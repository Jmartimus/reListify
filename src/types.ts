import { type sheets_v4 } from 'googleapis';
import { type GoogleAuth } from 'google-auth-library';
import { type JSONClient } from 'google-auth-library/build/src/auth/googleauth';

export type Sheets = sheets_v4.Sheets;

export type GSAuth = GoogleAuth<JSONClient>;

export interface ListingsApiResponse {
  is_success: boolean;
  data: ResponseData;
  message: string;
}

export interface PriceChunkingApiResponse {
  is_success: boolean;
  data: {
    task_id: string;
  };
  message: string;
}

export interface PriceChunkResponse {
  is_success: boolean;
  data: {
    result: {
      chunks: Chunk[];
    };
    task_status: string;
  };
  message: string;
}

type Chunk = {
  chunkMinPrice: number;
  chunkMaxPrice: number;
  chunkedlistSize: number;
};

interface ResponseData {
  user: UserData;
  mapState: MapState;
  regionState: RegionState;
  searchPageSeoObject: SeoObject;
  requestId: number;
  cat1: CategoryResults;
}

interface UserData {
  isLoggedIn: boolean;
  email: string;
  displayName: string;
  hasHousingConnectorPermission: boolean;
  savedHomesCount: number;
  personalizedSearchTraceID: string;
  guid: string;
  zuid: string;
  isBot: boolean;
  userSpecializedSEORegion: boolean;
}

interface MapState {
  customRegionPolygonWkt: null | string;
  schoolPolygonWkt: null | string;
  isCurrentLocationSearch: boolean;
  userPosition: LatLong | null;
}

interface LatLong {
  lat: number | null;
  lon: number | null;
}

interface RegionState {
  regionInfo: RegionInfo[];
  regionBounds: Bounds;
}

interface RegionInfo {
  regionType: number;
  regionId: number;
  regionName: string;
  displayName: string;
  isPointRegion: boolean;
}

interface Bounds {
  north: number;
  east: number;
  south: number;
  west: number;
}

interface SeoObject {
  baseUrl: string;
  windowTitle: string;
  metaDescription: string;
}

interface CategoryResults {
  searchResults: SearchResults;
  searchList: SearchList;
}

interface SearchResults {
  listResults: Listing[];
  resultsHash: string;
  homeRecCount: number;
  showForYouCount: number;
  mapResults: null;
  relaxedResults: unknown[];
  relaxedResultsHash: string;
}

type SearchList = {
  expansionDistance: number;
  zeroResultsFilters: unknown | null;
  message: string | null;
  adsConfig: AdsConfig;
  totalResultCount: number;
  resultsPerPage: number;
  totalPages: number;
  displayResultsCount: number;
  limitSearchResultsCount: number | null;
  listResultsTitle: string;
  resultContexts: ResultContext[];
  pageRules: string;
  shareConfig: ShareConfig;
  pagination: unknown;
};

type AdsConfig = {
  navAdSlot: string;
  displayAdSlot: string;
  targets: Record<string, unknown>;
  needsUpdate: boolean;
};

type ResultContext = {
  ssid: number;
  context: string | null;
  contextImage: string | null;
};

type ShareConfig = {
  captchaKey: string;
};

export interface Listing {
  zpid: string;
  id: string;
  providerListingId: null | string;
  imgSrc: string;
  hasImage: boolean;
  carouselPhotos: CarouselPhoto[];
  detailUrl: string;
  statusType: string;
  statusText: string;
  countryCurrency: string;
  price: string;
  unformattedPrice: number;
  address: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  isUndisclosedAddress: boolean;
  beds: number;
  baths: number;
  area: number;
  latLong: LatLong;
  isZillowOwned: boolean;
  variableData: VariableData;
  badgeInfo: null;
  hdpData: HdpData;
  isSaved: boolean;
  isUserClaimingOwner: boolean;
  isUserConfirmedClaim: boolean;
  pgapt: string;
  sgapt: string;
  zestimate: number;
  shouldShowZestimateAsPrice: boolean;
  has3DModel: boolean;
  hasVideo: boolean;
  isHomeRec: boolean;
  info2String: string;
  brokerName: string;
  hasAdditionalAttributions: boolean;
  isFeaturedListing: boolean;
  isShowcaseListing: boolean;
  availabilityDate: null | string;
  list: boolean;
  relaxed: boolean;
}

interface CarouselPhoto {
  url: string;
}

interface VariableData {
  type: string;
  text: string;
  data?: {
    isFresh: boolean;
  };
}

interface HdpData {
  homeInfo: HomeInfo;
}

interface HomeInfo {
  zpid: number;
  streetAddress: string;
  zipcode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  price: number;
  bathrooms: number;
  bedrooms: number;
  livingArea: number;
  homeType: string;
  homeStatus: string;
  daysOnZillow: number;
  isFeatured: boolean;
  shouldHighlight: boolean;
  zestimate: number;
  rentZestimate: number;
  listing_sub_type: ListingSubType;
  isUnmappable: boolean;
  isPreforeclosureAuction: boolean;
  homeStatusForHDP: string;
  priceForHDP: number;
  isNonOwnerOccupied: boolean;
  isPremierBuilder: boolean;
  isZillowOwned: boolean;
  currency: string;
  country: string;
  taxAssessedValue: number;
  lotAreaValue: number;
  lotAreaUnit: string;
  isShowcaseListing: boolean;
}

export interface GSListingDataObj {
  address: string;
  agentEmail: string;
  agentLicenseNumber: string;
  agentName: string;
  agentPhoneNumber: string;
  askingPrice: string;
  baths: string;
  beds: string;
  daysOnMarket: string;
  listingLink: string;
  mls: string;
  offerPrice: string;
  sqft: string;
  zip: string;
  zpid: string;
}

export interface PropertyApiResponse {
  is_success: boolean;
  data: PropertyData;
  message: string;
}

interface PropertyData {
  listingDataSource: string;
  zpid: number;
  city: string;
  state: string;
  homeStatus: string;
  address: Address;
  isListingClaimedByCurrentSignedInUser: boolean;
  isCurrentSignedInAgentResponsible: boolean;
  bedrooms: number;
  bathrooms: number;
  price: number;
  yearBuilt: number;
  streetAddress: string;
  zipcode: string;
  isCurrentSignedInUserVerifiedOwner: boolean;
  regionString: string;
  propertyUpdatePageLink: string | null;
  moveHomeMapLocationLink: string | null;
  propertyEventLogLink: string | null;
  editPropertyHistorylink: string | null;
  isRentalListingOffMarket: boolean;
  hdpUrl: string;
  listing_sub_type: ListingSubType;
  nearbyCities?: unknown[]; // Replace with a proper type if needed
  nearbyNeighborhoods?: unknown[]; // Replace with a proper type if needed
  country: string;
  nearbyZipcodes?: unknown[]; // Replace with a proper type if needed
  citySearchUrl: SearchUrl;
  zipcodeSearchUrl: SearchUrl;
  apartmentsForRentInZipcodeSearchUrl: SearchUrl;
  housesForRentInZipcodeSearchUrl: SearchUrl;
  abbreviatedAddress: string;
  neighborhoodRegion: unknown | null;
  building: unknown | null;
  isUndisclosedAddress: boolean;
  boroughId: unknown | null;
  providerListingID: unknown | null;
  neighborhoodSearchUrl: unknown | null;
  stateSearchUrl: SearchUrl;
  countySearchUrl: SearchUrl;
  boroughSearchUrl: unknown | null;
  communityUrl: unknown | null;
  isPremierBuilder: boolean;
  isZillowOwned: boolean;
  homeType: string;
  adTargets: unknown; // Replace with a proper type if needed
  currency: string;
  resoFacts: unknown; // Replace with a proper type if needed
  attributionInfo: AttributionInfo;
  listPriceLow: number | null;
  homeRecommendations: HomeRecommendations;
  livingArea: number;
  livingAreaValue: number;
  zestimate: number;
  newConstructionType: unknown | null;
  zestimateLowPercent: string;
  zestimateHighPercent: string;
  rentZestimate: number;
  restimateLowPercent: string;
  restimateHighPercent: string;
  schools?: unknown[]; // Replace with a proper type if needed
  homeValues: unknown | null;
  parentRegion: ParentRegion;
  nearbyHomes?: unknown[]; // Replace with a proper type if needed
  countyFIPS: string;
  parcelId: string;
  taxHistory?: unknown[]; // Replace with a proper type if needed
  priceHistory?: unknown[]; // Replace with a proper type if needed
  comps?: unknown[]; // Replace with a proper type if needed
  description: string;
  whatILove: string | null;
  contingentListingType: string | null;
  timeOnZillow: string;
  pageViewCount: number;
  favoriteCount: number;
  daysOnZillow: number;
  latitude: number;
  longitude: number;
  openHouseSchedule?: unknown[]; // Replace with a proper type if needed
  brokerageName: string;
  timeZone: string;
  listingMetadata: unknown; // Replace with a proper type if needed
  pals?: unknown[]; // Replace with a proper type if needed
  listingAccountUserId: string;
  homeInsights?: unknown[]; // Replace with a proper type if needed
  sellingSoon?: SellingSoon[];
  listingProvider: unknown | null;
  isIncomeRestricted: unknown | null;
  brokerId: unknown | null;
  ssid: number;
  monthlyHoaFee: number;
  mortgageRates: MortgageRates;
  propertyTaxRate: number;
  hdpTypeDimension: string;
  mlsid: string;
  propertyTypeDimension: string;
  enhancedBrokerImageUrl: string | null;
  tourEligibility: TourEligibility;
  contactFormRenderData: unknown; // Replace with a proper type if needed
  responsivePhotos?: unknown[]; // Replace with a proper type if needed
  buildingId: unknown | null;
  hasApprovedThirdPartyVirtualTourUrl: boolean;
  photoCount: number;
  livingAreaUnits: string;
  lotSize: number;
  lotAreaValue: number;
  lotAreaUnits: string;
  postingProductType: string;
  marketingName: unknown | null;
  richMedia: unknown | null;
  cityId: number;
  stateId: number;
  zipPlusFour: string;
  numberOfUnitsTotal: unknown | null;
  foreclosureData?: ForeclosureData;
  photos?: unknown[]; // Replace with a proper type if needed
  listingSubType: ListingSubType;
  tourViewCount: number;
  postingContact: PostingContact;
  vrModel: VRModel;
  thirdPartyVirtualTour: ThirdPartyVirtualTour;
  listingAccount: unknown | null;
  listingFeedID: unknown | null;
  livingAreaUnitsShort: string;
  priceChange: unknown | null;
  priceChangeDate: unknown | null;
  priceChangeDateString: unknown | null;
  formattedChip: FormattedChip;
  hideZestimate: boolean;
  comingSoonOnMarketDate: unknown | null;
  isPreforeclosureAuction: boolean;
  lastSoldPrice: unknown | null;
  isHousingConnector: boolean;
  responsivePhotosOriginalRatio?: unknown[]; // Replace with a proper type if needed
  thumb?: unknown[]; // Replace with a proper type if needed
  isRecentStatusChange: boolean;
  isNonOwnerOccupied: boolean;
  county: string;
  isFeatured: boolean;
  rentalApplicationsAcceptedType: string;
  listingTypeDimension: string;
  featuredListingTypeDimension: string;
  brokerIdDimension: string;
  keystoneHomeStatus: string;
  pageUrlFragment: string;
  isRentalsLeadCapMet: boolean;
  isPaidMultiFamilyBrokerId: boolean;
  selfTour: SelfTour;
}

interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  neighborhood: string | null;
  community: string | null;
  subdivision: string | null;
}

interface ListingSubType {
  is_newHome: boolean;
  is_FSBO: boolean;
  is_FSBA: boolean;
  is_foreclosure: boolean;
  is_bankOwned: boolean;
  is_forAuction: boolean;
  is_comingSoon: boolean;
  is_pending: boolean;
  is_openHouse: boolean;
}

interface SearchUrl {
  text?: string;
  path: string;
}

interface AttributionInfo {
  listingAgreement: string | null;
  mlsName: string;
  agentEmail: string | null;
  agentLicenseNumber: string;
  agentName: string;
  agentPhoneNumber: string | null;
  attributionTitle: string | null;
  brokerName: string;
  brokerPhoneNumber: string;
  buyerAgentMemberStateLicense: string | null;
  buyerAgentName: string | null;
  buyerBrokerageName: string | null;
  coAgentLicenseNumber: string | null;
  coAgentName: string | null;
  coAgentNumber: string | null;
  lastChecked: string;
  lastUpdated: string;
  listingOffices: ListingOffice[];
  listingAgents: ListingAgent[];
  mlsDisclaimer: string;
  mlsId: string;
  providerLogo: string | null;
}

interface ListingOffice {
  associatedOfficeType: string;
  officeName: string;
}

interface ListingAgent {
  associatedAgentType: string;
  memberFullName: string;
  memberStateLicense: string;
}

interface HomeRecommendations {
  blendedRecs: unknown[];
  displayShort: string;
}

interface ParentRegion {
  name: string;
}

interface SellingSoon {
  treatmentId: string;
  percentile: number;
}

interface MortgageRates {
  fifteenYearFixedRate: number;
  thirtyYearFixedRate: number;
  arm5Rate: number;
}

interface TourEligibility {
  isPropertyTourEligible: boolean;
  propertyTourOptions: PropertyTourOptions;
}

interface PropertyTourOptions {
  isFinal: boolean;
  tourAvailability?: unknown[];
  tourType: string;
}

interface SelfTour {
  hasSelfTour: boolean;
}

interface ForeclosureData {
  foreclosureDefaultFilingDate: string | null;
  foreclosureAuctionFilingDate: string | null;
  foreclosureLoanDate: string | null;
  foreclosureLoanOriginator: string | null;
  foreclosureLoanAmount: number | null;
  foreclosurePriorSaleDate: string | null;
  foreclosurePriorSaleAmount: number | null;
  foreclosureBalanceReportingDate: string | null;
  foreclosurePastDueBalance: number | null;
  foreclosureUnpaidBalance: number | null;
  foreclosureAuctionTime: string | null;
  foreclosureAuctionDescription: string | null;
  foreclosureAuctionCity: string | null;
  foreclosureAuctionLocation: string | null;
  foreclosureDate: string | null;
  foreclosureAmount: number | null;
  foreclosingBank: string | null;
  foreclosureJudicialState: boolean;
  foreclosureType: string;
  isForeclosureAuction: boolean;
}

interface PostingContact {
  email: string | null;
  phone: string | null;
  url: string | null;
  hasSelfTour: boolean;
}

interface VRModel {
  renderType: string | null;
}

interface ThirdPartyVirtualTour {
  externalTourUrl: string | null;
  source: string | null;
}

interface FormattedChip {
  displayText: string;
}
