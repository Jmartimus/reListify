export enum STATUS_MESSAGES {
  STEP_1 = '1. Authenticating google sheet.',
  STEP_2 = '2. Fetching Zillow listings for the specified URL.',
  STEP_3 = '3. Filtering listings by zip code.',
  STEP_4 = '4. Filter out new listings that already exist using ZPID numbers.',
  STEP_5 = '5. Reformatting listings into the shape they need to be for the google sheet.',
  STEP_6 = '6. Updating listings with additional data.',
  STEP_7 = '7. Remove outdated listings from google sheet.',
  STEP_8 = '8. Update google sheet with listings.',
  STEP_9 = '9. Update timestamp in google sheet.',
}

export enum AUTH_MESSAGES {
  SUCCESS = 'Authentication successful.',
  DENIED = 'Authentication failed. User not allowed.',
}

export const postRange = 'Sheet1!A3';

export const startingRowIdx = 3;

export const timeStampCell = 'O2';

export const zpidColRange = 'Sheet1!N2:N';

export const delayTime = 750;

// Could be different than above but needed to not overload API.
export const APIdelayTime = 500;
export const ListingsAPIdelayTime = 5000;

export const EXCLUDED_ZIP_CODES = [
  '71101',
  '71103',
  '71107',
  '71108',
  '71055',
  '71058',
  '71060',
  '71082',
  '71061',
  '71064',
  '71033',
];

export const BASE_URL = 'https://app.scrapeak.com/v1/scrapers/zillow';

export const PRICE_CHUNKS_ENDPOINT = '/priceChunks';

export const TASK_STATUS_ENDPOINT = '/status';

export const PRICE_CHUNK_LIST_ENDPOINT = '/result';

export const LISTINGS_ENDPOINT = '/listing';

export const PROPERTY_ENDPOINT = '/property';

export const ZILLOW_SEARCH_URL =
  'https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-94.14070649064237%2C%22east%22%3A-93.33733124650175%2C%22south%22%3A32.29404605172289%2C%22north%22%3A32.74334063011857%7D%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22price%22%3A%7B%22max%22%3A200000%7D%2C%22mp%22%3A%7B%22max%22%3A925%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A11%2C%22usersSearchTerm%22%3A%22%22%7D';
