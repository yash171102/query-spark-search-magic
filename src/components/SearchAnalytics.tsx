
import React from 'react';
import { TrendingUp, Search, Target, Zap } from 'lucide-react';

const SearchAnalytics: React.FC = () => {
  const metrics = [
    {
      label: 'Total Searches',
      value: '12,847',
      change: '+12.5%',
      icon: Search,
      color: 'blue'
    },
    {
      label: 'Conversion Rate',
      value: '3.4%',
      change: '+0.8%',
      icon: Target,
      color: 'green'
    },
    {
      label: 'Personalization Impact',
      value: '+24%',
      change: '+5.2%',
      icon: Zap,
      color: 'purple'
    },
    {
      label: 'Zero Results Rate',
      value: '2.1%',
      change: '-1.3%',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Search Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600', 
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          }[metric.color];

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Top Search Terms</h3>
          <div className="space-y-2">
            {[
              { term: 'running shoes', count: 1247 },
              { term: 'lipstick', count: 892 },
              { term: 'nike sneakers', count: 654 },
              { term: 'shampoo', count: 543 }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{item.term}</span>
                <span className="text-gray-500">{item.count} searches</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">AI Features Impact</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Spell Correction</span>
              <span className="text-green-600">+18% results found</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Semantic Search</span>
              <span className="text-green-600">+31% relevance</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Personalization</span>
              <span className="text-green-600">+24% engagement</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Fuzzy Matching</span>
              <span className="text-green-600">+15% satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;
