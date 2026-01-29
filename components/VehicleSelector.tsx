'use client';

import { useState, useMemo } from 'react';
import { supportedVehicles, VehicleBrand, VehicleModel } from '@/lib/vehicles';
import { ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface VehicleSelectorProps {
  onSelect: (brand: string, model: string, year: string) => void;
  selectedVehicle?: { brand: string; model: string; year: string } | null;
  locale?: string;
}

export default function VehicleSelector({ onSelect, selectedVehicle, locale = 'zh-CN' }: VehicleSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState<'brand' | 'model' | 'year'>('brand');

  const isZh = locale.startsWith('zh');

  // 过滤品牌
  const filteredBrands = useMemo(() => {
    if (!searchQuery) return supportedVehicles;
    const query = searchQuery.toLowerCase();
    return supportedVehicles.filter(
      brand =>
        brand.brand.toLowerCase().includes(query) ||
        brand.brandZh.includes(searchQuery)
    );
  }, [searchQuery]);

  // 解析年份范围
  const parseYears = (yearsStr: string): string[] => {
    if (yearsStr.includes('需要')) return [yearsStr]; // 特殊情况如 "需要5AU"
    
    const parts = yearsStr.split('-');
    if (parts.length === 2) {
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);
      const years: string[] = [];
      for (let y = start; y <= end; y++) {
        years.push(y.toString());
      }
      return years;
    }
    return [yearsStr];
  };

  const handleBrandSelect = (brand: VehicleBrand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setStep('model');
    setSearchQuery('');
  };

  const handleModelSelect = (model: VehicleModel) => {
    setSelectedModel(model);
    setStep('year');
  };

  const handleYearSelect = (year: string) => {
    if (selectedBrand && selectedModel) {
      onSelect(selectedBrand.brand, selectedModel.name, year);
    }
  };

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setStep('brand');
    setSearchQuery('');
  };

  // 已选择完成的显示
  if (selectedVehicle) {
    const brand = supportedVehicles.find(b => b.brand === selectedVehicle.brand);
    return (
      <div className="glass-holo rounded-xl border border-neon-cyan/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-neon-cyan" />
            <div>
              <p className="text-sm text-gray-400">{isZh ? '已选择车型' : 'Selected Vehicle'}</p>
              <p className="text-white font-medium">
                {isZh && brand ? brand.brandZh : selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-neon-cyan hover:text-neon-blue transition-colors"
          >
            {isZh ? '更换' : 'Change'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-holo rounded-xl border border-neon-blue/30 p-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span className="text-neon-cyan">🚗</span>
        {isZh ? '选择您的车型' : 'Select Your Vehicle'}
      </h3>

      {/* 步骤指示器 */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className={`px-3 py-1 rounded-full ${step === 'brand' ? 'bg-neon-blue/30 text-neon-cyan' : selectedBrand ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-gray-700 text-gray-400'}`}>
          {isZh ? '1. 品牌' : '1. Brand'}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500 rotate-[-90deg]" />
        <span className={`px-3 py-1 rounded-full ${step === 'model' ? 'bg-neon-blue/30 text-neon-cyan' : selectedModel ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-gray-700 text-gray-400'}`}>
          {isZh ? '2. 车型' : '2. Model'}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500 rotate-[-90deg]" />
        <span className={`px-3 py-1 rounded-full ${step === 'year' ? 'bg-neon-blue/30 text-neon-cyan' : 'bg-gray-700 text-gray-400'}`}>
          {isZh ? '3. 年份' : '3. Year'}
        </span>
      </div>

      {/* 品牌选择 */}
      {step === 'brand' && (
        <div>
          {/* 搜索框 */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isZh ? '搜索品牌...' : 'Search brand...'}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
            />
          </div>

          {/* 品牌列表 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {filteredBrands.map((brand) => (
              <button
                key={brand.brand}
                onClick={() => handleBrandSelect(brand)}
                className="p-2 text-center rounded-lg bg-gray-800/50 hover:bg-neon-blue/20 border border-gray-700 hover:border-neon-blue/50 transition-all group"
              >
                <p className="text-white font-medium text-sm group-hover:text-neon-cyan">
                  {isZh ? brand.brandZh : brand.brand}
                </p>
                <p className="text-xs text-gray-500">{brand.models.length} {isZh ? '款' : 'models'}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 车型选择 */}
      {step === 'model' && selectedBrand && (
        <div>
          <button
            onClick={() => setStep('brand')}
            className="text-sm text-neon-cyan hover:text-neon-blue mb-3 flex items-center gap-1"
          >
            ← {isZh ? '返回品牌' : 'Back to brands'}
          </button>
          <p className="text-gray-400 text-sm mb-3">
            {isZh ? brand.brandZh : selectedBrand.brand} - {isZh ? '选择车型' : 'Select model'}
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {selectedBrand.models.map((model) => (
              <button
                key={model.name}
                onClick={() => handleModelSelect(model)}
                className="p-3 text-left rounded-lg bg-gray-800/50 hover:bg-neon-blue/20 border border-gray-700 hover:border-neon-blue/50 transition-all group"
              >
                <p className="text-white font-medium text-sm group-hover:text-neon-cyan">
                  {isZh && model.nameZh ? model.nameZh : model.name}
                </p>
                <p className="text-xs text-gray-500">{model.years}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 年份选择 */}
      {step === 'year' && selectedBrand && selectedModel && (
        <div>
          <button
            onClick={() => setStep('model')}
            className="text-sm text-neon-cyan hover:text-neon-blue mb-3 flex items-center gap-1"
          >
            ← {isZh ? '返回车型' : 'Back to models'}
          </button>
          <p className="text-gray-400 text-sm mb-3">
            {isZh ? selectedBrand.brandZh : selectedBrand.brand} {isZh && selectedModel.nameZh ? selectedModel.nameZh : selectedModel.name} - {isZh ? '选择年份' : 'Select year'}
          </p>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {parseYears(selectedModel.years).map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className="p-2 text-center rounded-lg bg-gray-800/50 hover:bg-neon-cyan/20 border border-gray-700 hover:border-neon-cyan/50 transition-all text-white hover:text-neon-cyan font-medium"
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <p className="text-xs text-gray-500 mt-4">
        {isZh 
          ? '* 大部分车型需要原车配备ACC自适应巡航和车道辅助功能' 
          : '* Most vehicles require factory ACC and lane assist features'}
      </p>
    </div>
  );
}
