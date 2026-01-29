'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

// Mock data - In production, this would come from API/database
const mockCategories = [
  {
    id: '1',
    name: 'Cameras',
    slug: 'cameras',
    parentId: null,
    productCount: 12,
    order: 1,
  },
  {
    id: '2',
    name: 'HD Cameras',
    slug: 'hd-cameras',
    parentId: '1',
    productCount: 8,
    order: 1,
  },
  {
    id: '3',
    name: '4K Cameras',
    slug: '4k-cameras',
    parentId: '1',
    productCount: 4,
    order: 2,
  },
  {
    id: '4',
    name: 'Sensors',
    slug: 'sensors',
    parentId: null,
    productCount: 24,
    order: 2,
  },
  {
    id: '5',
    name: 'Radar Sensors',
    slug: 'radar-sensors',
    parentId: '4',
    productCount: 10,
    order: 1,
  },
  {
    id: '6',
    name: 'Ultrasonic Sensors',
    slug: 'ultrasonic-sensors',
    parentId: '4',
    productCount: 8,
    order: 2,
  },
  {
    id: '7',
    name: 'LiDAR Sensors',
    slug: 'lidar-sensors',
    parentId: '4',
    productCount: 6,
    order: 3,
  },
  {
    id: '8',
    name: 'Control Units',
    slug: 'control-units',
    parentId: null,
    productCount: 18,
    order: 3,
  },
  {
    id: '9',
    name: 'Accessories',
    slug: 'accessories',
    parentId: null,
    productCount: 32,
    order: 4,
  },
];

export default function AdminCategoriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // Build category tree
  const buildCategoryTree = () => {
    const rootCategories = mockCategories.filter((cat) => !cat.parentId);
    return rootCategories.map((root) => ({
      ...root,
      children: mockCategories.filter((cat) => cat.parentId === root.id),
    }));
  };

  const categoryTree = buildCategoryTree();

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      console.log('Delete category:', categoryId);
      // In production, call delete API
    }
  };

  const handleEdit = (categoryId: string) => {
    setEditingCategory(categoryId);
    // In production, open edit modal with category data
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('categories')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage product categories and hierarchy
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              {t('addCategory')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Tree */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('categoryName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryTree.map((category) => (
                  <>
                    {/* Parent Category */}
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FolderIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{category.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {category.productCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Child Categories */}
                    {category.children.map((child) => (
                      <tr key={child.id} className="hover:bg-gray-50 bg-gray-25">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 pl-8">
                            <span className="text-gray-400">└─</span>
                            <span className="text-sm text-gray-900">{child.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{child.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {child.productCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(child.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(child.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Count */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Total: {mockCategories.length} categories
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Category Management Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Parent categories can contain multiple child categories</li>
            <li>• Deleting a parent category will also delete all child categories</li>
            <li>• Categories with products cannot be deleted</li>
            <li>• Use descriptive names and SEO-friendly slugs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
