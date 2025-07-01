
import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { SearchResult, User } from '../types/search';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  user: User | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, results, isLoading, user }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-lg font-medium text-gray-700">Searching...</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">
          Try adjusting your search terms or removing some filters
        </p>
      </div>
    );
  }

  const PersonalizedBadge = () => (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      🎯 Personalized
    </span>
  );

  const MerchandisedBadge = ({ type }: { type: 'boost' | 'pin' }) => (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      {type === 'pin' ? '📌 Pinned' : '⬆️ Boosted'}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results for "{query}"
          </h2>
          <p className="text-gray-600 mt-1">
            {results.length} products found
            {user?.isReturning && (
              <span className="ml-2 text-blue-600">
                • Personalized for {user.firstName}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg bg-gray-100"
              />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
              </button>
              <div className="absolute top-3 left-3 space-y-1">
                {product.isPersonalized && <PersonalizedBadge />}
                {product.isMerchandised && product.merchandisingType && (
                  <MerchandisedBadge type={product.merchandisingType} />
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  ${product.price}
                </div>
                <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
              
              {product.attributes.color && (
                <div className="mt-2 text-xs text-gray-500">
                  Color: {product.attributes.color}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
