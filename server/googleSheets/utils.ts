import { GSAuth, GSListingDataObj, type Sheets } from '../../src/types';
import {
  postRange,
  startingRowIdx,
  timeStampCell,
  zpidColRange,
} from '../../src/constants';
import { spreadsheetId } from '../secrets';
import { getFormattedTimestamp } from '../listMaker/utils';

export async function updateGoogleSheet(
  auth: GSAuth,
  sheets: Sheets,
  updatedListings: GSListingDataObj[]
) {
  // Convert the listing data into a format that can be appended to the Google Sheet (ORDER IS IMPORTANT HERE)
  const values = updatedListings.map((listing) => [
    listing.askingPrice,
    listing.offerPrice,
    listing.beds,
    listing.baths,
    listing.sqft,
    listing.daysOnMarket,
    `=HYPERLINK("${listing.listingLink}", "${listing.address}")`,
    listing.zip,
    listing.mls,
    listing.agentName,
    listing.agentPhoneNumber,
    listing.agentEmail,
    listing.agentLicenseNumber,
    listing.zpid,
  ]);

  const requestBody = {
    values,
  };

  try {
    // Call the Sheets API to update the sheet with new data
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: postRange,
      valueInputOption: 'USER_ENTERED', // This ensures the formula is evaluated
      insertDataOption: 'INSERT_ROWS', // Inserts new rows
      requestBody,
    });

    console.log(`${response?.data?.updates?.updatedCells} cells updated.`);
  } catch (err) {
    console.error('The API returned an error: ' + err);
  }
}

/**
 * Fetches ZPID numbers from a specified column in a Google Sheets document.
 *
 * @param {Sheets} sheets - The authenticated Google Sheets client.
 * @param {string} spreadsheetId - The ID of the Google Spreadsheet to fetch data from.
 * @returns {Promise<string[]>} - A promise that resolves to an array of ZPID numbers.
 */
export const fetchZPIDNumbersFromSheet = async (
  sheets: Sheets,
  spreadsheetId: string
): Promise<string[]> => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: zpidColRange,
    });

    const rows = response.data.values || [];

    // Map over the rows and extract the first item from each row (ZPID)
    return rows.map((row) => row[0]);
  } catch (error) {
    console.error('Error fetching ZPID numbers from Google Sheets:', error);
    return [];
  }
};

/**
 * Deletes rows from Google Sheets where the listing's ZPID is no longer in the incoming list.
 *
 * @param {Sheets} sheets - The authenticated Google Sheets client.
 * @param {string} spreadsheetId - The ID of the Google Spreadsheet.
 * @param {string[]} existingZPIDs - An array of ZPID numbers from the existing list of listings on the google sheet.
 * @param {string[]} incomingZPIDList - An array of ZPID numbers from the incoming list of listings.
 * @returns {Promise<void>}
 */
export const removeOldListingsFromSheet = async (
  sheets: Sheets,
  spreadsheetId: string,
  existingZPIDs: string[],
  incomingZPIDList: string[]
): Promise<void> => {
  try {
    // Step 1: Identify rows to delete (ZPIDs not in the incoming list)
    const rowsToDelete = existingZPIDs.reduce<number[]>((acc, zpid, index) => {
      if (!incomingZPIDList.includes(zpid)) {
        acc.push(index + startingRowIdx); // Account for the row offset, assuming the range starts from row 3
      }
      return acc;
    }, []);

    // Step 2: Delete rows in batches
    if (rowsToDelete.length > 0) {
      for (const rowIndex of rowsToDelete.reverse()) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0, // Assuming the first sheet, update this ID if necessary
                    dimension: 'ROWS',
                    startIndex: rowIndex - 1, // Convert 1-based to 0-based index
                    endIndex: rowIndex,
                  },
                },
              },
            ],
          },
        });
      }
    }

    console.log(`Removed ${rowsToDelete.length} rows from the sheet.`);
  } catch (error) {
    console.error('Error removing old listings from Google Sheets:', error);
  }
};

/**
 * Updates Google Sheet at a specific cell (B2) with the current formatted timestamp.
 *
 * @param {GSAuth} auth - The authorization object required to access Google Sheets API.
 * @param {Sheets} sheets - An instance of the Google Sheets API service.
 * @param {string} spreadsheetId - The ID of the Google Spreadsheet.
 */
export async function updateTimestampInSheet(
  auth: GSAuth,
  sheets: Sheets,
  spreadsheetId: string
) {
  // Get the current formatted timestamp
  const timestamp = getFormattedTimestamp();

  const requestBody = {
    values: [[timestamp]],
  };

  try {
    // Use the Sheets API to update the cell in Column B Row 2 (B2)
    const response = await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: timeStampCell,
      valueInputOption: 'USER_ENTERED',
      requestBody,
    });

    console.log(`Updated ${timeStampCell} with timestamp: ${timestamp}`);
    console.log(`${response.data.updatedCells} cell(s) updated.`);
  } catch (err) {
    console.error('Error updating Google Sheet: ', err);
  }
}
