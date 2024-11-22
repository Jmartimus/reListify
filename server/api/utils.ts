import axios from 'axios';
import {
  BASE_URL,
  LISTINGS_ENDPOINT,
  PRICE_CHUNK_LIST_ENDPOINT,
  PRICE_CHUNKS_ENDPOINT,
  TASK_STATUS_ENDPOINT,
  ZILLOW_SEARCH_URL,
} from '../../src/constants';
import { API_KEY } from '../secrets';
import {
  ListingsApiResponse,
  PriceChunkingApiResponse,
  PriceChunkResponse,
} from '../../src/types';

// /**
//  * Waits for the completion of a task by repeatedly checking its status.
//  * The function polls the task status until it reaches 'SUCCESS', with a delay between each check.
//  *
//  * @param {string} taskId - The unique identifier of the task to check the status for.
//  * @returns {Promise<void>} - A promise that resolves when the task is successfully completed.
//  * @throws {Error} - Throws an error if the request fails or if the task status is unsuccessful after retries.
//  */
// export const waitForTaskCompletion = async (taskId: string): Promise<void> => {
//   let taskStatus;

//   try {
//     do {
//       console.log('Checking task status...');

//       // Make a GET request to check the task status
//       const response = await axios.get(`${BASE_URL}${TASK_STATUS_ENDPOINT}`, {
//         params: {
//           api_key: API_KEY,
//           task_id: taskId,
//         },
//       });

//       taskStatus = response.data.data.status;

//       if (taskStatus === 'FAILED') {
//         throw new Error(`Task failed with status: ${taskStatus}`);
//       }

//       if (taskStatus !== 'SUCCESS') {
//         console.log('Task not completed yet, waiting...');
//         await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
//       }
//     } while (taskStatus !== 'SUCCESS');

//     console.log('Task completed successfully!');
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // Axios-specific error handling
//       if (error.response) {
//         console.error(
//           `Error: Server responded with status ${error.response.status} - ${error.response.statusText}`
//         );
//       } else if (error.request) {
//         console.error('Error: No response received from server.');
//       } else {
//         console.error('Error: Request setup failed.', error.message);
//       }
//     } else {
//       // Non-Axios error
//       console.error(
//         'An error occurred while waiting for task completion:',
//         error.message
//       );
//     }

//     throw error;
//   }
// };

// /**
//  * Initiates the creation of price chunks for the provided Zillow search URL.
//  * The function sends a request to the price chunking API and returns the task details.
//  *
//  * @returns {Promise<PriceChunkingApiResponse>} - A promise that resolves to the response data containing task details.
//  * @throws {Error} - Throws an error if the request fails or if the API response is not successful.
//  */
// export const createPriceChunks =
//   async (): Promise<PriceChunkingApiResponse> => {
//     try {
//       // Make a GET request to create price chunks
//       const response = await axios.get(`${BASE_URL}${PRICE_CHUNKS_ENDPOINT}`, {
//         params: {
//           api_key: API_KEY,
//           url: ZILLOW_SEARCH_URL,
//         },
//       });

//       if (!response.data.is_success) {
//         throw new Error(
//           `Failed to create price chunks: ${response.data.message}`
//         );
//       }

//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         // Axios-specific error handling
//         if (error.response) {
//           console.error(
//             `Error: Server responded with status ${error.response.status} - ${error.response.statusText}`
//           );
//         } else if (error.request) {
//           console.error('Error: No response received from server.');
//         } else {
//           console.error('Error: Request setup failed.', error.message);
//         }
//       } else {
//         // Non-Axios error
//         console.error(
//           'An error occurred while creating price chunks:',
//           error.message
//         );
//       }

//       throw error;
//     }
//   };

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
      // else {
      //   console.error('Error: Request setup failed.', error.message);
      // }
    }
    // else {
    //   // Non-Axios error
    //   console.error(
    //     'An error occurred while fetching listings:',
    //     error.message
    //   );
    // }

    throw error;
  }
};

// /**
//  * Fetches the price chunk list for a given task after the task has been completed.
//  * This function retrieves the price ranges used to scrape listings without hitting Zillow's property limits.
//  *
//  * @param {string} taskId - The task ID of the completed price chunking process.
//  * @returns {Promise<PriceChunkResponse>} - A promise that resolves to the response data containing the price chunk list.
//  * @throws {Error} - Throws an error if the request fails or if the API response is not successful.
//  */
// export const getPriceChunkList = async (
//   taskId: string
// ): Promise<PriceChunkResponse> => {
//   try {
//     // Make a GET request to fetch the price chunk list
//     const response = await axios.get(
//       `${BASE_URL}${PRICE_CHUNK_LIST_ENDPOINT}`,
//       {
//         params: {
//           api_key: API_KEY,
//           task_id: taskId,
//         },
//       }
//     );

//     if (!response.data.is_success) {
//       throw new Error(
//         `Failed to fetch price chunk list: ${response.data.message}`
//       );
//     }

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // Axios-specific error handling
//       if (error.response) {
//         console.error(
//           `Error: Server responded with status ${error.response.status} - ${error.response.statusText}`
//         );
//       } else if (error.request) {
//         console.error('Error: No response received from server.');
//       } else {
//         console.error('Error: Request setup failed.', error.message);
//       }
//     } else {
//       // Non-Axios error
//       console.error(
//         'An error occurred while fetching the price chunk list:',
//         error.message
//       );
//     }

//     throw error;
//   }
// };

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
