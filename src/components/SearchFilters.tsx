
import React, { useState, useEffect } from 'react';
import { SearchResult, SearchFilters as SearchFiltersType } from '../types/search';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFiltersProps {
  results: SearchResult[];
  onFiltersChange: (filters: SearchFiltersType) => void;
  currentFilters: SearchFiltersType;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  results,
  onFiltersChange,
  currentFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    categories: true,
    price: true,
    colors: true
  });

  // Extract available options from results
  const availableFilters = React.useMemo(() => {
    const brands = [...new Set(results.map(r => r.brand))];
    const categories = [...new Set(results.map(r => r.category))];
    const colors = [...new Set(results.map(r => r.attributes.color).filter(Boolean))];
    const priceRange = {
      min: Math.min(...results.map(r => r.price)),
      max: Math.max(...results.map(r => r.price))
    };

    return { brands, categories, colors, priceRange };
  }, [results]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = currentFilters.brands || [];
    const newBrands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand);
    
    onFiltersChange({
      ...currentFilters,
      brands: newBrands.length > 0 ? newBrands : undefined
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = currentFilters.categories || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFiltersChange({
      ...currentFilters,
      categories: newCategories.length > 0 ? newCategories : undefined
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...currentFilters,
      priceRange: { min, max }
    });
  };

  if (results.length === 0) {
    return null;
  }

  const FilterSection = ({ title, isExpanded, onToggle, children }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Brands Filter */}
        {availableFilters.brands.length > 0 && (
          <FilterSection
            title="Brands"
            isExpanded={expandedSections.brands}
            onToggle={() => toggleSection('brands')}
          >
            {availableFilters.brands.map(brand => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={currentFilters.brands?.includes(brand) || false}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
                <span className="text-xs text-gray-500">
                  ({results.filter(r => r.brand === brand).length})
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* Categories Filter */}
        {availableFilters.categories.length > 0 && (
          <FilterSection
            title="Categories"
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
            {availableFilters.categories.map(category => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={currentFilters.categories?.includes(category) || false}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
                <span className="text-xs text-gray-500">
                  ({results.filter(r => r.category === category).length})
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={currentFilters.priceRange?.min || ''}
                onChange={(e) => {
                  const min = parseInt(e.target.value) || 0;
                  const max = currentFilters.priceRange?.max || availableFilters.priceRange.max;
                  handlePriceRangeChange(min, max);
                }}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={currentFilters.priceRange?.max || ''}
                onChange={(e) => {
                  const max = parseInt(e.target.value) || availableFilters.priceRange.max;
                  const min = currentFilters.priceRange?.min || 0;
                  handlePriceRangeChange(min, max);
                }}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="text-xs text-gray-500">
              Range: ${availableFilters.priceRange.min} - ${availableFilters.priceRange.max}
            </div>
          </div>
        </FilterSection>

        {/* Colors Filter */}
        {availableFilters.colors.length > 0 && (
          <FilterSection
            title="Colors"
            isExpanded={expandedSections.colors}
            onToggle={() => toggleSection('colors')}
          >
            <div className="grid grid-cols-2 gap-2">
              {availableFilters.colors.map(color => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
