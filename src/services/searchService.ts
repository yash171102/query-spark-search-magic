import { User, SearchResult, SearchFilters } from '../types/search';

// Mock product database
const mockProducts: SearchResult[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    brand: "Nike",
    category: "Running Shoes",
    price: 150,
    currency: "USD",
    image: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 1250,
    isPersonalized: true,
    isMerchandised: false,
    attributes: {
      color: "Black",
      size: ["8", "9", "10", "11"],
      material: "Mesh"
    }
  },
  {
    id: 2,
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    category: "Running Shoes",
    price: 180,
    currency: "USD",
    image: "/placeholder.svg", 
    rating: 4.7,
    reviewCount: 890,
    isPersonalized: true,
    isMerchandised: true,
    merchandisingType: 'boost',
    attributes: {
      color: "White",
      size: ["7", "8", "9", "10", "11"],
      material: "Primeknit"
    }
  },
  {
    id: 3,
    name: "MAC Ruby Woo Lipstick",
    brand: "MAC",
    category: "Lipstick",
    price: 19,
    currency: "USD",
    image: "/placeholder.svg",
    rating: 4.3,
    reviewCount: 2100,
    isPersonalized: false,
    isMerchandised: true,
    merchandisingType: 'pin',
    attributes: {
      color: "Red",
      finish: "Matte"
    }
  },
  {
    id: 4,
    name: "L'Oréal Color Riche Lipstick",
    brand: "L'Oréal",
    category: "Lipstick", 
    price: 12,
    currency: "USD",
    image: "/placeholder.svg",
    rating: 4.1,
    reviewCount: 750,
    isPersonalized: false,
    isMerchandised: false,
    attributes: {
      color: "Pink",
      finish: "Satin"
    }
  },
  {
    id: 5,
    name: "Head & Shoulders Shampoo",
    brand: "Head & Shoulders",
    category: "Hair Care",
    price: 8,
    currency: "USD",
    image: "/placeholder.svg",
    rating: 4.0,
    reviewCount: 1800,
    isPersonalized: false,
    isMerchandised: false,
    attributes: {
      type: "Anti-Dandruff",
      size: "400ml"
    }
  },
  {
    id: 6,
    name: "L'Oréal Professional Shampoo",
    brand: "L'Oréal",
    category: "Hair Care",
    price: 25,
    currency: "USD",
    image: "/placeholder.svg",
    rating: 4.4,
    reviewCount: 450,
    isPersonalized: false,
    isMerchandised: false,
    attributes: {
      type: "For Oily Hair",
      size: "300ml"
    }
  }
];

// Fuzzy search and spell correction
const correctSpelling = (query: string): string => {
  const corrections: { [key: string]: string } = {
    'lapstick': 'lipstick',
    'runni': 'running',
    'shampoo': 'shampoo',
    'shampo': 'shampoo',
    'sneeker': 'sneaker',
    'snekers': 'sneakers'
  };
  
  const words = query.toLowerCase().split(' ');
  const correctedWords = words.map(word => corrections[word] || word);
  return correctedWords.join(' ');
};

// Semantic search - extract intent from natural language
const parseSemanticQuery = (query: string) => {
  const lowerQuery = query.toLowerCase();
  const result: any = {
    brand: null,
    color: null,
    priceConstraint: null,
    category: null
  };

  // Extract brand
  const brands = ['nike', 'adidas', 'puma', 'mac', 'loreal', 'head & shoulders'];
  for (const brand of brands) {
    if (lowerQuery.includes(brand)) {
      result.brand = [brand];
      break;
    }
  }

  // Extract color
  const colors = ['black', 'white', 'red', 'blue', 'pink'];
  for (const color of colors) {
    if (lowerQuery.includes(color)) {
      result.color = [color];
      break;
    }
  }

  // Extract price constraint
  const priceMatch = lowerQuery.match(/under (\d+)|less than (\d+)|below (\d+)/);
  if (priceMatch) {
    result.priceConstraint = {
      max: parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3])
    };
  }

  return result;
};

export const mockSearchService = {
  async search(query: string, user: User | null, filters: SearchFilters = {}): Promise<SearchResult[]> {
    console.log('Search service called with:', { query, user: user?.firstName, filters });
    
    // Spell correction
    const correctedQuery = correctSpelling(query);
    console.log('Corrected query:', correctedQuery);

    // Semantic parsing
    const semanticData = parseSemanticQuery(correctedQuery);
    console.log('Semantic data:', semanticData);

    // Filter products based on query
    let results = mockProducts.filter(product => {
      const searchText = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      const queryLower = correctedQuery.toLowerCase();
      
      // Basic text matching
      const textMatch = searchText.includes(queryLower) || 
                       queryLower.split(' ').some(word => searchText.includes(word));
      
      // Semantic matching
      let semanticMatch = true;
      if (semanticData.brand && !semanticData.brand.some((b:string) => product.brand.toLowerCase().includes(b))) {
        semanticMatch = false;
      }
      if (semanticData.color && !semanticData.color.some((c:string) => JSON.stringify(product.attributes).toLowerCase().includes(c))) {
        semanticMatch = false;
      }
      if (semanticData.priceConstraint?.max && product.price > semanticData.priceConstraint.max) {
        semanticMatch = false;
      }

      return textMatch || semanticMatch;
    });

    // Apply filters
    if (filters.brands && filters.brands.length > 0) {
      results = results.filter(product => filters.brands!.includes(product.brand));
    }
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(product => filters.categories!.includes(product.category));
    }
    if (filters.priceRange) {
      results = results.filter(product => 
        product.price >= (filters.priceRange!.min || 0) && 
        product.price <= (filters.priceRange!.max || Infinity)
      );
    }

    // Personalization for returning users
    if (user?.isReturning) {
      results = results.map(product => ({
        ...product,
        isPersonalized: user.preferences.brands.includes(product.brand) || 
                       user.preferences.categories.includes(product.category)
      }));

      // Sort personalized results higher
      results.sort((a, b) => {
        if (a.isPersonalized && !b.isPersonalized) return -1;
        if (!a.isPersonalized && b.isPersonalized) return 1;
        if (a.isMerchandised && !b.isMerchandised) return -1;
        if (!a.isMerchandised && b.isMerchandised) return 1;
        return b.rating - a.rating;
      });
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Search results:', results);
    return results;
  },

  async getSuggestions(query: string, user: User | null): Promise<string[]> {
    const correctedQuery = correctSpelling(query);
    
    const baseSuggestions = [
      'running shoes',
      'running sneakers', 
      'lipstick red',
      'lipstick matte',
      'shampoo for oily hair',
      'shampoo for dandruff',
      'shampoo loreal',
      'nike air max',
      'adidas running shoes',
      'black leather jacket'
    ];

    // Filter suggestions based on query
    let suggestions = baseSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(correctedQuery.toLowerCase())
    );

    // Add personalized suggestions for returning users
    if (user?.isReturning && user.searchHistory.length > 0) {
      const personalizedSuggestions = user.searchHistory.filter(term =>
        term.toLowerCase().includes(correctedQuery.toLowerCase())
      );
      suggestions = [...personalizedSuggestions, ...suggestions];
    }

    // Remove duplicates and limit results
    suggestions = [...new Set(suggestions)].slice(0, 6);

    return suggestions;
  }
};
