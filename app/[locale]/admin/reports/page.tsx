'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

// Mock data - In production, this would come from API/database
const mockSalesData = {
  totalRevenue: 125430.50,
  totalOrders: 342,
  averageOrderValue: 366.78,
  topProducts: [
    { name: 'Comma 3X - ADAS', sales: 45, revenue: 58499.55 },
    { name: 'Radar Sensor Kit', sales: 38, revenue: 17099.62 },
    { name: 'Control Unit Pro', sales: 32, revenue: 28799.68 },
    { name: 'HD Camera Module', sales: 56, revenue: 11199.44 },
    { name: 'GPS Module', sales: 42, revenue: 6299.58 },
  ],
  salesByRegion: [
    { region: 'North America', orders: 156, revenue: 57234.50 },
    { region: 'Europe', orders: 98, revenue: 35890.25 },
    { region: 'Asia', orders: 72, revenue: 26430.75 },
    { region: 'Other', orders: 16, revenue: 5875.00 },
  ],
  salesByMonth: [
    { month: 'Jan', revenue: 125430.50, orders: 342 },
    { month: 'Dec', revenue: 118234.25, orders: 328 },
    { month: 'Nov', revenue: 105678.90, orders: 298 },
    { month: 'Oct', revenue: 98456.75, orders: 276 },
  ],
};

export default function AdminReportsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [dateRange, setDateRange] = useState('last-30-days');
  const [productFilter, setProductFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleExport = () => {
    console.log('Export report');
    // In production, generate and download report
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('salesReport')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and analyze sales performance
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('dateRange')}
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filterByProduct')}
              </label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Products</option>
                <option value="cameras">Cameras</option>
                <option value="sensors">Sensors</option>
                <option value="control-units">Control Units</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filterByRegion')}
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(mockSalesData.totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">
              {mockSalesData.totalOrders}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Average Order Value
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(mockSalesData.averageOrderValue)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Top Selling Products
            </h2>
            <div className="space-y-4">
              {mockSalesData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales by Region */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Sales by Region
            </h2>
            <div className="space-y-4">
              {mockSalesData.salesByRegion.map((region, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {region.region}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(region.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(region.revenue / mockSalesData.totalRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{region.orders} orders</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Sales Trend (Last 4 Months)
            </h2>
            <div className="space-y-4">
              {mockSalesData.salesByMonth.map((month, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {month.month}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{month.orders} orders</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(month.revenue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${(month.revenue / 130000) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            Report Information
          </h3>
          <p className="text-sm text-blue-800">
            This report shows sales data for the selected date range and filters. Export
            the report to download a detailed CSV file with all transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
