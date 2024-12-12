import { GSAuth, GSListingDataObj, type Sheets } from '../../src/types';
import {
  postRange,
  SHEET_NAME,
  startingRowIdx,
  timeStampCell,
  zpidColRange,
} from '../../src/constants';
import { spreadsheetId } from '../secrets';
import { getFormattedTimestamp, parsePrice } from '../listMaker/utils';

export async function updateGoogleSheet(
  auth: GSAuth,
  sheets: Sheets,
  updatedListings: GSListingDataObj[]
) {
  // Step 1: Sort the listings
  const highlightedListings = updatedListings.filter(
    (listing) => listing.highlight
  );
  const nonHighlightedListings = updatedListings.filter(
    (listing) => !listing.highlight
  );

  // Sort both arrays by price in ascending order
  highlightedListings.sort(
    (a, b) => parsePrice(a.askingPrice) - parsePrice(b.askingPrice)
  );
  nonHighlightedListings.sort(
    (a, b) => parsePrice(a.askingPrice) - parsePrice(b.askingPrice)
  );

  // Combine sorted arrays with highlighted listings at the top and an empty row in between
  const sortedListings = [
    ...highlightedListings,
    {
      address: '',
      agentEmail: '',
      agentLicenseNumber: '',
      agentName: '',
      agentPhoneNumber: '',
      askingPrice: '',
      baths: '',
      beds: '',
      daysOnMarket: '',
      highlight: false,
      emptyRow: true,
      listingLink: '',
      mls: '',
      offerPrice: '',
      sqft: '',
      zip: '',
      zpid: '',
    }, // Placeholder for the empty row
    ...nonHighlightedListings,
  ];

  // Step 2: Convert the listing data into a format for the Google Sheet (ORDER IS IMPORTANT HERE)
  const values = sortedListings.map((listing) => {
    if (listing.emptyRow) {
      return ['', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    }
    return [
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
    ];
  });

  const requestBody = {
    values,
  };

  try {
    // Step 3: Append sorted rows to the sheet
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: postRange,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody,
    });

    console.log(`${response?.data?.updates?.updatedCells} cells updated.`);
  } catch (err) {
    console.error('The API returned an error: ' + err);
    return;
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

/**
 * Retrieves the sheet ID for a given sheet name in a specified Google Spreadsheet.
 *
 * @param {Sheets} sheets - The authenticated Google Sheets instance.
 * @returns {Promise<number>} - A promise that resolves to the sheet ID.
 * @throws {Error} - Throws an error if the sheet ID cannot be retrieved.
 */
export const getSheetId = async (sheets: Sheets): Promise<number> => {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Check if the response data exists and has sheets
    if (!spreadsheet.data || !spreadsheet.data.sheets) {
      throw new Error('No sheets found in the spreadsheet.');
    }

    // Find the sheet with the matching title
    const sheet = spreadsheet.data.sheets.find(
      (sheet) => sheet.properties?.title === SHEET_NAME
    );

    // Check if the sheet was found
    if (!sheet) {
      throw new Error(`Sheet with name "${SHEET_NAME}" not found.`);
    }

    // Check if the sheetId is valid
    if (
      sheet.properties?.sheetId === undefined ||
      sheet.properties?.sheetId === null
    ) {
      throw new Error(`Unable to retrieve sheet ID.`);
    }

    // Return the sheet ID
    return sheet.properties.sheetId;
  } catch (error: unknown) {
    console.error('Error retrieving sheet ID:', error);
    throw new Error(`Error retrieving sheet ID: ${(error as Error).message}`);
  }
};
