import axios from 'axios';
import {
  GSListingDataObj,
  Listing,
  ListingsApiResponse,
  PropertyApiResponse,
} from '../../src/types';
import { API_KEY } from '../secrets';
import type WebSocket from 'ws';
import { delay } from '../listMaker/utils';
import {
  APIdelayTime,
  BASE_URL,
  LISTINGS_ENDPOINT,
  ListingsAPIdelayTime,
  PROPERTY_ENDPOINT,
  STATUS_MESSAGES,
} from '../../src/constants';
import { updateZillowSearchUrl } from './utils';

/**
 * Fetches home listings from Zillow based on a search query.
 *
 * @param {WebSocket} ws - The WebSocket connection to send updates to.
 * @param {string} zillowSearchUrl - The search URL to fetch listings from.
 * @returns {Promise<ListingsApiResponse | null>} - A promise that resolves to the API response containing listings and pagination data, or null if there was an error.
 */
export const getListings = async (
  ws: WebSocket,
  zillowSearchUrl: string,
  pageNumber: number
): Promise<ListingsApiResponse | null> => {
  try {
    // Figure out how much time I need between searches - I am thinking it may need to be a full 2 seconds
    await delay(ListingsAPIdelayTime);
    // Fetch data from the Zillow API
    const response = await axios.get<ListingsApiResponse>(
      `${BASE_URL}${LISTINGS_ENDPOINT}`,
      {
        params: {
          api_key: API_KEY,
          url: zillowSearchUrl, // Pass the search URL as a parameter
        },
      }
    );

    const responseContent = response.data;

    if (responseContent.is_success) {
      const listings = responseContent.data.cat1.searchResults.listResults;
      const totalPages = responseContent.data.cat1.searchList.totalPages;

      ws.send(
        `Successfully retrieved ${listings.length} listings from page ${pageNumber} out of ${totalPages} pages from Zillow`
      );

      // Return the full response including listings and totalPages for pagination
      return responseContent;
    } else {
      const errorMessage = `Error fetching data: ${responseContent.message}`;
      console.error(errorMessage);
      ws.send(errorMessage); // Send error message via WebSocket
      return null;
    }
  } catch (error) {
    const errorMessage = `Error fetching data: ${error}`;
    console.error(errorMessage);

    // Handle axios error conditions
    if (axios.isAxiosError(error)) {
      if (error.response) {
        ws.send(
          `Error: Server responded with status ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        ws.send('Error: No response received from server.');
      } else {
        ws.send('Error: Request setup failed.');
      }
    } else {
      ws.send(errorMessage);
    }

    return null;
  }
};

/**
 * Fetches all listings for a given Zillow search URL by paginating through each page.
 *
 * @param {websocket} ws - Passing the websocket so we can update user.
 * @param {string} zillowSearchUrl - The URL for the Zillow search with searchQueryState parameters.
 * @returns {Promise<object[]>} - A promise that resolves to an array containing all listings from all pages.
 * @throws {Error} - Throws an error if any step in the process fails.
 */
export const fetchAllListings = async (ws: WebSocket) => {
  try {
    let allListings: Listing[] = [];
    let currentPage = 1;
    let totalPages = 1; // Default, will update after first request

    ws.send(STATUS_MESSAGES.STEP_2); // Send step 2 status
    // Loop through pages until we fetch all pages
    while (currentPage <= totalPages) {
      // Update the URL to reflect the current page number
      const updatedSearchUrl = updateZillowSearchUrl(currentPage);

      // Fetch the listings for the current page
      const listingsData = await getListings(ws, updatedSearchUrl, currentPage);

      if (!listingsData?.is_success) {
        console.error(`Error fetching listings: ${listingsData?.message}`);
        break; // Stop if there's an error
      }

      // Get the listings from the current page
      const listings = listingsData.data.cat1.searchResults.listResults;
      allListings = allListings.concat(listings); // Accumulate listings from each page

      // Update totalPages based on the data received
      totalPages = listingsData.data.cat1.searchList.totalPages || 1;
      console.log(`Current page: ${currentPage}, Total pages: ${totalPages}`);
      ws.send(`Pulling listings from page ${currentPage} of ${totalPages}.`);

      currentPage++; // Increment the page number for the next iteration
    }

    console.log(`Fetched a total of ${allListings.length} listings.`);
    return allListings;
  } catch (error) {
    console.error('An error occurred while fetching all listings:', error);
    throw error;
  }
};

/**
 * Updates a list of formatted listings by fetching additional data from an API for each listing's zpid.
 *
 * @param {GSListingDataObj[]} listings - A list of formatted listings to update.
 * @param {WebSocket} ws - The WebSocket connection to send updates to.
 * @returns {Promise<GSListingDataObj[]>} - A promise that resolves to a list of updated listings.
 */
export const updateListingsWithAdditionalData = async (
  listings: GSListingDataObj[],
  ws: WebSocket
): Promise<GSListingDataObj[]> => {
  const updatedListings: GSListingDataObj[] = [];
  let count = 1;

  // Iterate over each listing and fetch additional data with a delay
  for (const listing of listings) {
    try {
      await delay(APIdelayTime);
      console.log('Updating the following listing:', {
        address: listing.address,
      });
      ws.send(
        `Updating the following listing: ${
          listing.address
        }, ${count} of ${listings.length.toString()}.`
      );

      const zpid = Number(listing.zpid); // Convert zpid to a number

      const response = await axios.get<PropertyApiResponse>(
        `${BASE_URL}${PROPERTY_ENDPOINT}`,
        {
          params: {
            api_key: API_KEY,
            zpid,
          },
        }
      );

      const additionalData = response.data.data.attributionInfo;

      updatedListings.push({
        ...listing,
        agentEmail: additionalData.agentEmail ?? listing.agentEmail,
        agentLicenseNumber:
          additionalData.agentLicenseNumber ?? listing.agentLicenseNumber,
        agentName: additionalData.agentName,
        agentPhoneNumber:
          additionalData.agentPhoneNumber ?? additionalData.brokerPhoneNumber,
        mls: additionalData.mlsId,
      });
      count = count + 1;
    } catch (error) {
      console.error(`Error fetching data for zpid ${listing.zpid}:`, error);
      updatedListings.push(listing); // Return the original listing if the API call fails
    }
  }

  return updatedListings;
};
