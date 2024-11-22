import { authenticateSheets } from '../googleSheets/auth';
import type WebSocket from 'ws';
import {
  fetchZPIDNumbersFromSheet,
  removeOldListingsFromSheet,
  updateGoogleSheet,
  updateTimestampInSheet,
} from '../googleSheets/utils';
import { delay, filterListingsByZipCode, getListingDetails } from './utils';
import { delayTime, STATUS_MESSAGES } from '../../src/constants';
import { spreadsheetId } from '../secrets';
import {
  fetchAllListings,
  // fetchZillowListings,
  updateListingsWithAdditionalData,
} from '../api';
import { MOCK_LISTING_1, MOCK_LISTING_2 } from './mockData';
import { Listing } from '../../src/types';

//TODO
// 2. Look at price chunking to fix pagination and limited listings issue.

export const runListMaker = async (ws: WebSocket): Promise<void> => {
  try {
    // Authenticating sheet
    ws.send(STATUS_MESSAGES.STEP_1);
    const result = await authenticateSheets();
    await delay(delayTime); // Delay so user can see message update.

    if (!result) {
      ws.send(
        'Failed google sheet authentication - closing down. Please try again later.'
      );
      return;
    }

    const { auth, sheets } = result;

    //Uncomment to use real zillow listings
    // const listings = await fetchZillowListings(ws);
    const allListings = await fetchAllListings(ws);

    console.log({ allListingsLength: allListings.length });

    // if (!listings) {
    //   ws.send('No listings - closing down. Please try again later.');
    //   return;
    // }

    // console.log({ listings });

    //Uncomment to filter real zillow listings
    // Filtering listings by zip code
    // ws.send(STATUS_MESSAGES.STEP_3);
    // const filteredListingsByZip = filterListingsByZipCode(listings);
    // await delay(delayTime); // Delay so user can see message update.

    // const listings = MOCK_LISTING_2;

    // Filter out new listings that already exist using ZPID numbers
    // ws.send(STATUS_MESSAGES.STEP_4);
    // const existingZPIDNumbers = await fetchZPIDNumbersFromSheet(
    //   sheets,
    //   spreadsheetId
    // );
    // Grab the list of incomingZPIDs before filtering out listings that are incoming AND on the sheet.
    // const incomingZPIDs = listings.map((listing) => listing.zpid);
    // const filteredListings = listings.filter(
    //   (listing) => !existingZPIDNumbers.includes(listing.zpid)
    // );
    // await delay(delayTime); // Delay so user can see message update.

    // Reformatting listings into the shape they need to be for the google sheet.
    // ws.send(STATUS_MESSAGES.STEP_5);
    // const formattedListings = getListingDetails(filteredListings);
    // await delay(delayTime); // Delay so user can see message update.

    // Updating listings with additional data from /property endpoint
    // ws.send(STATUS_MESSAGES.STEP_6);
    // const updatedListings = formattedListings;
    // const updatedListings = await updateListingsWithAdditionalData(
    //   formattedListings,
    //   ws
    // );
    // await delay(delayTime); // Delay so user can see message update.

    // Remove outdated listings from google sheet.
    // ws.send(STATUS_MESSAGES.STEP_7);

    // await removeOldListingsFromSheet(
    //   sheets,
    //   spreadsheetId,
    //   existingZPIDNumbers,
    //   incomingZPIDs
    // );
    // await delay(delayTime); // Delay so user can see message update.

    // // Update google sheet with listings
    // ws.send(STATUS_MESSAGES.STEP_8);
    // await updateGoogleSheet(auth, sheets, updatedListings);
    // await delay(delayTime); // Delay so user can see message update.

    // // Update timestamp in google sheet.
    // ws.send(STATUS_MESSAGES.STEP_9);
    // await updateTimestampInSheet(auth, sheets, spreadsheetId);
    // await delay(delayTime); // Delay so user can see message update.
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error accessing or updating Google Sheet:', error);
      ws.send(`Error: ${error.message}`);
    } else {
      console.error(
        'Unexpected error type accessing or updating Google Sheet:',
        error
      );
      ws.send(`Unexpected error type: ${typeof error}`);
    }
  } finally {
    ws.close();
  }
};
