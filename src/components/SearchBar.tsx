
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getSuggestions, searchProducts } from '../api/client';

const SearchBar = ({ userId }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced suggestion fetch
  const fetchSuggestions = useCallback(async (input) => {
    if (input.length <= 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    setError(null);
    try {
      const data = await getSuggestions(input);
      console.log('Suggestions received:', data);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error.response?.status, error.response?.data, error.message);
      setError(`Failed to load suggestions: ${error.message}`);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Handle query change with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, fetchSuggestions]);

  // Handle search submission
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }
    setQuery(searchQuery);
    setShowSuggestions(false);
    setLoadingSearch(true);
    setError(null);
    try {
      const data = await searchProducts(searchQuery, userId);
      console.log('Search results received:', data);
      navigate('/search', {
        state: {
          results: data.results || [],
          query: data.query || searchQuery,
          correctedQuery: data.corrected_query || searchQuery,
        },
      });
    } catch (error) {
      console.error('Error searching:', error.response?.status, error.response?.data, error.message);
      setError(`Failed to load search results: ${error.message}`);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
      handleSearch(suggestions[selectedSuggestion]);
    } else {
      handleSearch();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        handleSearch(suggestions[selectedSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            placeholder="Search for products (e.g., Adidas black running shoes under 50 KWD)"
            className="block w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white shadow-sm transition-all duration-200
                     hover:shadow-md focus:shadow-lg disabled:opacity-50"
            disabled={loadingSearch}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading Suggestions */}
      {loadingSuggestions && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm">Loading suggestions...</p>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && !loadingSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3
                          ${selectedSuggestion === index ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
              >
                <Search className="h-4 w-4 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Search State */}
      {loadingSearch && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
