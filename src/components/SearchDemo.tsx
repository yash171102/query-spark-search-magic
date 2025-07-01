
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import SearchAnalytics from './SearchAnalytics';
import UserProfile from './UserProfile';
import { mockSearchService } from '../services/searchService';
import { User, SearchResult, SearchFilters as SearchFiltersType } from '../types/search';

const SearchDemo = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Simulate user login
  useEffect(() => {
    const mockUser: User = {
      id: 1,
      email: 'sarah.johnson@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      isReturning: true,
      preferences: {
        brands: ['Nike', 'Adidas', 'Puma'],
        categories: ['Running Shoes', 'Sportswear'],
        colors: ['Black', 'White', 'Blue'],
        priceRange: { min: 20, max: 200 }
      },
      searchHistory: ['running shoes', 'nike sneakers', 'workout clothes'],
      purchaseHistory: [
        { productId: 1, productName: 'Nike Air Max', category: 'Running Shoes', price: 120 }
      ]
    };
    setCurrentUser(mockUser);
  }, []);

  const handleSearch = async (query: string, appliedFilters: SearchFiltersType = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setSearchQuery(query);

    try {
      console.log('Searching for:', query, 'with filters:', appliedFilters);
      const results = await mockSearchService.search(query, currentUser, appliedFilters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestions = async (query: string) => {
    if (query.length > 2) {
      const suggestions = await mockSearchService.getSuggestions(query, currentUser);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    if (searchQuery) {
      handleSearch(searchQuery, newFilters);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Search Demo
              </h1>
              <span className="text-sm text-gray-500">Personalized E-commerce Search</span>
            </div>
            <UserProfile user={currentUser} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onSuggestionsRequest={handleSuggestions}
            suggestions={searchSuggestions}
            placeholder="Search for products... (try 'running shoes', 'lipstick', or 'runni')"
          />
        </div>

        {searchQuery && (
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-64 flex-shrink-0">
              <SearchFilters
                results={searchResults}
                onFiltersChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              <SearchResults
                query={searchQuery}
                results={searchResults}
                isLoading={isLoading}
                user={currentUser}
              />
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Experience AI-Powered Search
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our intelligent search system understands your preferences, corrects typos, 
                and provides personalized results that get better over time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized Results</h3>
                  <p className="text-gray-600 text-sm">Results tailored to your preferences and history</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Understanding</h3>
                  <p className="text-gray-600 text-sm">Natural language processing and semantic search</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-time Adaptation</h3>
                  <p className="text-gray-600 text-sm">Results improve as you browse and interact</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        <SearchAnalytics />
      </main>
    </div>
  );
};

export default SearchDemo;
