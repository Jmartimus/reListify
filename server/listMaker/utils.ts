import { EXCLUDED_ZIP_CODES } from '../../src/constants';
import { GSListingDataObj, Listing } from '../../src/types';

/**
 * Filters out listings based on included zip codes.
 *
 * @param {Listing[]} listings - An array of listing objects.
 * @returns {Listing[]} - A filtered array of listings excluding those without the specified zip codes.
 */
export const filterListingsByZipCode = (listings: Listing[]): Listing[] => {
  return listings.filter(
    (listing) => !EXCLUDED_ZIP_CODES.includes(listing.addressZipcode)
  );
};

/**
 * Maps the listings array to an array of objects containing key details about each listing.
 *
 * @param {Listing[]} listings - An array of listing objects.
 * @returns {GSListingDataObj[]} - An array of objects containing key information about each listing.
 */
export const getListingDetails = (listings: Listing[]): GSListingDataObj[] => {
  return listings.map((listing) => {
    const home_data = listing.hdpData.homeInfo;
    return {
      address: home_data.streetAddress,
      agentEmail: 'No data found',
      agentLicenseNumber: 'No data found',
      agentName: 'No data found',
      agentPhoneNumber: 'No data found',
      askingPrice: listing.price,
      baths: home_data.bathrooms.toString(),
      beds: home_data.bedrooms.toString(),
      daysOnMarket: home_data.daysOnZillow.toString(),
      listingLink: listing.detailUrl,
      mls: 'No data found',
      offerPrice: (listing.unformattedPrice * 0.7).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
      sqft: listing.area.toString(),
      zip: listing.addressZipcode,
      zpid: listing.zpid,
    };
  });
};

/**
 * Delays the execution of code for a given number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} - A promise that resolves after the delay.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns the current timestamp in the format:
 * "Friday, August 06, 2010 4:47:02 PM".
 *
 * The format includes:
 * - Day of the week (long format, e.g., "Friday")
 * - Month (long format, e.g., "August")
 * - Day (2-digit format, e.g., "06")
 * - Year (numeric format, e.g., "2010")
 * - Time in 12-hour format with seconds and AM/PM (e.g., "4:47:02 PM")
 *
 * @returns {string} The formatted timestamp.
 */
export const getFormattedTimestamp = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date());
};
