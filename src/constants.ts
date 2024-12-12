export enum STATUS_MESSAGES {
  STEP_1 = '1. Authenticating google sheet.',
  STEP_2 = '2. Fetching Zillow listings for the specified URL.',
  STEP_3 = '3. Filtering listings by zip code.',
  STEP_4 = '4. Filtering listings by days on market.',
  STEP_5 = '5. Filter out new listings that already exist using ZPID numbers.',
  STEP_6 = '6. Reformatting listings into the shape they need to be for the google sheet.',
  STEP_7 = '7. Updating listings with additional data.',
  STEP_8 = '8. Remove outdated listings from google sheet.',
  STEP_9 = '9. Update google sheet with listings.',
  STEP_10 = '10. Update timestamp in google sheet.',
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
  'https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-95.18576619933332%2C%22east%22%3A-93.02695272277082%2C%22south%22%3A31.773667691820542%2C%22north%22%3A33.07193830885179%7D%2C%22usersSearchTerm%22%3A%22%22%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22price%22%3A%7B%22min%22%3Anull%7D%2C%22mp%22%3A%7B%22min%22%3Anull%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22pf%22%3A%7B%22value%22%3Atrue%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22pmf%22%3A%7B%22value%22%3Atrue%7D%7D%2C%22isListVisible%22%3Atrue%2C%22category%22%3A%22cat1%22%2C%22mapZoom%22%3A9%2C%22customRegionId%22%3A%22caeb36754bX1-CRj8hvhapwj71s_umo1g%22%7D';

export const EXCLUSIONARY_TERMS = [
  'updated',
  'remodeled',
  'renovated',
  'completely updated',
  'newly renovated',
  'totally renovated',
  'newly updated',
  'newly remodeled',
  'totally updated',
  'totally remodeled',
  'everything new',
  'new everything',
  'new construction',
  'brand new',
];

export const GOOD_DEAL_TERMS = [
  'handyman special',
  'tlc',
  'investor special',
  'flip',
  'flipper',
  'needs work',
  'will not go fha',
  'will not go va',
  'handyman',
  'investor',
  'investment',
  'investing',
  'as is',
  'no repairs',
];

export const SHEET_NAME = 'All Listings';
