import { useTranslations } from 'next-intl';
import Link from 'next/link';

const categories = [
  {
    id: '1',
    name: 'Cameras',
    icon: '📷',
    description: 'High-resolution cameras for autonomous driving',
    productCount: 24,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: '2',
    name: 'Sensors',
    icon: '📡',
    description: 'Advanced sensors for environmental detection',
    productCount: 18,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: '3',
    name: 'Control Units',
    icon: '🖥️',
    description: 'Powerful processing units for real-time decisions',
    productCount: 12,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: '4',
    name: 'Accessories',
    icon: '🔧',
    description: 'Essential accessories and mounting hardware',
    productCount: 36,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: '5',
    name: 'Radar Systems',
    icon: '📊',
    description: 'Long-range radar for obstacle detection',
    productCount: 15,
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: '6',
    name: 'LiDAR',
    icon: '🔦',
    description: '3D mapping and environment scanning',
    productCount: 9,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: '7',
    name: 'GPS Modules',
    icon: '🛰️',
    description: 'Precision GPS for accurate positioning',
    productCount: 21,
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: '8',
    name: 'Software',
    icon: '💾',
    description: 'AI software and firmware updates',
    productCount: 8,
    gradient: 'from-violet-500 to-purple-500',
  },
];

export default function CategoriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('common');

  return (
    <main className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Product Categories</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive range of autonomous driving hardware
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/${locale}/products?category=${category.name.toLowerCase()}`}
              className="glass-strong rounded-2xl p-8 card-hover glow-hover border border-white/10 group animate-in fade-in slide-in-from-bottom-4 duration-1000"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className="text-6xl mb-4 float">{category.icon}</div>

              {/* Category Name */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Product Count */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  {category.productCount} products
                </span>
                <div className={`w-8 h-8 bg-gradient-to-r ${category.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center glass-strong rounded-2xl p-12 border border-white/10 glow">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Can't Find What You're Looking For?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Contact our team for custom solutions and expert advice
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
