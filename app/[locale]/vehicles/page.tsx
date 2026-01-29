'use client';

import { useState, useMemo } from 'react';
import { supportedVehicles, getTotalVehicleCount, searchVehicles } from '@/lib/vehicles';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function VehiclesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());

  const isZh = locale.startsWith('zh');
  const totalCount = getTotalVehicleCount();

  // 搜索过滤
  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return supportedVehicles;
    return searchVehicles(searchQuery);
  }, [searchQuery]);

  const toggleBrand = (brand: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brand)) {
      newExpanded.delete(brand);
    } else {
      newExpanded.add(brand);
    }
    setExpandedBrands(newExpanded);
  };

  const expandAll = () => {
    setExpandedBrands(new Set(supportedVehicles.map(v => v.brand)));
  };

  const collapseAll = () => {
    setExpandedBrands(new Set());
  };

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-neon">
              {isZh ? '支持车型列表' : 'Supported Vehicles'}
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {isZh 
              ? `MyPilot 目前支持 ${supportedVehicles.length} 个品牌，${totalCount}+ 款车型`
              : `MyPilot supports ${supportedVehicles.length} brands and ${totalCount}+ vehicle models`}
          </p>
          <div className="glass-holo inline-block px-6 py-3 rounded-full border border-neon-cyan/30">
            <p className="text-neon-cyan text-sm">
              {isZh 
                ? '⚠️ 大部分车型需要原车配备ACC自适应巡航和车道辅助功能'
                : '⚠️ Most vehicles require factory ACC and lane assist features'}
            </p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="glass-holo rounded-2xl border border-neon-blue/30 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isZh ? '搜索品牌或车型...' : 'Search brand or model...'}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>

            {/* Expand/Collapse buttons */}
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2 text-sm bg-gray-800/50 hover:bg-neon-blue/20 border border-gray-700 hover:border-neon-blue/50 rounded-lg text-gray-300 hover:text-white transition-all"
              >
                {isZh ? '展开全部' : 'Expand All'}
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 text-sm bg-gray-800/50 hover:bg-neon-blue/20 border border-gray-700 hover:border-neon-blue/50 rounded-lg text-gray-300 hover:text-white transition-all"
              >
                {isZh ? '收起全部' : 'Collapse All'}
              </button>
            </div>
          </div>

          {/* Results count */}
          {searchQuery && (
            <p className="text-gray-400 text-sm mt-4">
              {isZh 
                ? `找到 ${filteredVehicles.length} 个品牌，${filteredVehicles.reduce((sum, b) => sum + b.models.length, 0)} 款车型`
                : `Found ${filteredVehicles.length} brands, ${filteredVehicles.reduce((sum, b) => sum + b.models.length, 0)} models`}
            </p>
          )}
        </div>

        {/* Vehicle List */}
        <div className="space-y-4">
          {filteredVehicles.map((brand) => (
            <div
              key={brand.brand}
              className="glass-holo rounded-2xl border border-neon-blue/20 overflow-hidden"
            >
              {/* Brand Header */}
              <button
                onClick={() => toggleBrand(brand.brand)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neon-blue/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center border border-neon-blue/30">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">
                      {isZh ? brand.brandZh : brand.brand}
                      {isZh && <span className="text-gray-400 text-sm ml-2">({brand.brand})</span>}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {brand.models.length} {isZh ? '款支持车型' : 'supported models'}
                    </p>
                  </div>
                </div>
                {expandedBrands.has(brand.brand) ? (
                  <ChevronUpIcon className="w-6 h-6 text-neon-cyan" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Models List */}
              {expandedBrands.has(brand.brand) && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {brand.models.map((model) => (
                      <div
                        key={model.name}
                        className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-neon-cyan/30 transition-colors"
                      >
                        <p className="text-white font-medium">
                          {isZh && model.nameZh ? model.nameZh : model.name}
                        </p>
                        {isZh && model.nameZh && (
                          <p className="text-gray-500 text-sm">{model.name}</p>
                        )}
                        <p className="text-neon-cyan text-sm mt-1">
                          {model.years}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {isZh ? '未找到匹配的车型' : 'No matching vehicles found'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-neon-cyan hover:text-neon-blue transition-colors"
            >
              {isZh ? '清除搜索' : 'Clear search'}
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="glass-holo rounded-2xl border border-neon-purple/30 p-8 inline-block">
            <h3 className="text-2xl font-bold text-white mb-4">
              {isZh ? '找到您的车型了吗？' : 'Found your vehicle?'}
            </h3>
            <p className="text-gray-300 mb-6">
              {isZh 
                ? '立即购买 MyPilot，让您的爱车拥有智能驾驶能力'
                : 'Get MyPilot now and upgrade your car with smart driving capabilities'}
            </p>
            <Link
              href={`/${locale}/products/mypilot-pro`}
              className="inline-block cyber-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-neon-blue/50 hover:shadow-neon-purple/50 hover:scale-105"
            >
              {isZh ? '立即购买' : 'Buy Now'}
            </Link>
          </div>
        </div>

        {/* Contact for unlisted vehicles */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            {isZh 
              ? '没有找到您的车型？' 
              : "Don't see your vehicle?"}
            <Link
              href={`/${locale}/contact`}
              className="text-neon-cyan hover:text-neon-blue ml-2 transition-colors"
            >
              {isZh ? '联系我们咨询' : 'Contact us'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
