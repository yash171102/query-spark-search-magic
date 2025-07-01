
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isReturning: boolean;
  preferences: {
    brands: string[];
    categories: string[];
    colors: string[];
    priceRange: { min: number; max: number };
  };
  searchHistory: string[];
  purchaseHistory: Array<{
    productId: number;
    productName: string;
    category: string;
    price: number;
  }>;
}

export interface SearchResult {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
  reviewCount: number;
  isPersonalized: boolean;
  isMerchandised: boolean;
  merchandisingType?: 'boost' | 'pin';
  attributes: {
    color?: string;
    size?: string[];
    material?: string;
    [key: string]: any;
  };
}

export interface SearchFilters {
  brands?: string[];
  categories?: string[];
  colors?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  sizes?: string[];
}

export interface SearchAnalytics {
  totalSearches: number;
  avgResultsPerSearch: number;
  topSearchTerms: Array<{ term: string; count: number }>;
  conversionRate: number;
  zeroResultsRate: number;
}
