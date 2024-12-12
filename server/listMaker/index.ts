import { authenticateSheets } from '../googleSheets/auth';
import type WebSocket from 'ws';
import {
  fetchZPIDNumbersFromSheet,
  removeOldListingsFromSheet,
  updateGoogleSheet,
  updateTimestampInSheet,
} from '../googleSheets/utils';
import {
  delay,
  filterListingsByDaysOnMarket,
  filterListingsByZipCode,
  getListingDetails,
} from './utils';
import { delayTime, STATUS_MESSAGES } from '../../src/constants';
import { spreadsheetId } from '../secrets';
import { fetchAllListings, updateListingsWithAdditionalData } from '../api';
// import { MOCK_LISTING_1, MOCK_LISTING_2 } from './mockData';

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
    const listings = await fetchAllListings(ws);

    if (!listings) {
      ws.send('No listings - closing down. Please try again later.');
      return;
    }

    // Filtering listings by zip code
    ws.send(STATUS_MESSAGES.STEP_3);
    const filteredListingsByZip = filterListingsByZipCode(listings);
    await delay(delayTime); // Delay so user can see message update.

    // Filtering listings by days on market.
    ws.send(STATUS_MESSAGES.STEP_4);
    const filteredListingsByDaysOnMarket = filterListingsByDaysOnMarket(
      filteredListingsByZip
    );
    await delay(delayTime); // Delay so user can see message update.

    // Filter out new listings that already exist using ZPID numbers
    ws.send(STATUS_MESSAGES.STEP_5);
    const existingZPIDNumbers = await fetchZPIDNumbersFromSheet(
      sheets,
      spreadsheetId
    );
    // Grab the list of incomingZPIDs before filtering out listings that are incoming AND on the sheet.
    const incomingZPIDs = filteredListingsByDaysOnMarket.map(
      (listing) => listing.zpid
    );
    const filteredListings = filteredListingsByDaysOnMarket.filter(
      (listing) => !existingZPIDNumbers.includes(listing.zpid)
    );
    await delay(delayTime); // Delay so user can see message update.

    // Reformatting listings into the shape they need to be for the google sheet.
    ws.send(STATUS_MESSAGES.STEP_6);
    const formattedListings = getListingDetails(filteredListings);
    await delay(delayTime); // Delay so user can see message update.

    // Updating listings with additional data from /property endpoint
    ws.send(STATUS_MESSAGES.STEP_7);
    // const updatedListings = formattedListings;
    const updatedListings = await updateListingsWithAdditionalData(
      formattedListings,
      ws
    );
    await delay(delayTime); // Delay so user can see message update.

    // Remove outdated listings from google sheet.
    ws.send(STATUS_MESSAGES.STEP_8);

    await removeOldListingsFromSheet(
      sheets,
      spreadsheetId,
      existingZPIDNumbers,
      incomingZPIDs
    );
    await delay(delayTime); // Delay so user can see message update.

    // Update google sheet with listings
    ws.send(STATUS_MESSAGES.STEP_9);
    await updateGoogleSheet(auth, sheets, updatedListings);
    await delay(delayTime); // Delay so user can see message update.

    // Update timestamp in google sheet.
    ws.send(STATUS_MESSAGES.STEP_10);
    await updateTimestampInSheet(auth, sheets, spreadsheetId);
    await delay(delayTime); // Delay so user can see message update.
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
