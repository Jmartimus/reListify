import axios from 'axios';
import {
  BASE_URL,
  LISTINGS_ENDPOINT,
  ZILLOW_SEARCH_URL,
} from '../../src/constants';
import { API_KEY } from '../secrets';
import { ListingsApiResponse } from '../../src/types';

/**
 * Fetches property listings from Zillow for the given search URL.
 * Sends a request to the listings endpoint with the API key and search URL parameters.
 *
 * @param {string} zillowURL - The zillow search URL to get listings for.
 * @returns {Promise<object>} - A promise that resolves to the response data containing the listings.
 * @throws {Error} - Throws an error if the request fails or if the API response is not successful.
 */
export const getListings = async (
  zillowURL: string
): Promise<ListingsApiResponse> => {
  try {
    // Make a GET request to fetch the listings
    const response = await axios.get(`${BASE_URL}${LISTINGS_ENDPOINT}`, {
      params: {
        api_key: API_KEY,
        url: zillowURL,
      },
    });

    if (!response.data.is_success) {
      throw new Error(`Failed to fetch listings: ${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        console.error(
          `Error: Server responded with status ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        console.error('Error: No response received from server.');
      }
    }
    throw error;
  }
};

/**
 * Updates the Zillow search URL with the given page number.
 *
 * @param {number} page - The current page number for pagination.
 * @returns {string} - The updated search URL with the page number.
 * @throws {Error} - Throws an error if 'searchQueryState' is not found in the URL.
 */
export const updateZillowSearchUrl = (page: number) => {
  const url = new URL(ZILLOW_SEARCH_URL);
  const searchQueryStateParam = url.searchParams.get('searchQueryState');

  if (!searchQueryStateParam) {
    throw new Error('searchQueryState parameter not found in the URL');
  }

  const searchQueryState = JSON.parse(searchQueryStateParam);

  searchQueryState.pagination = { currentPage: page };

  url.searchParams.set('searchQueryState', JSON.stringify(searchQueryState));

  return url.toString();
};
