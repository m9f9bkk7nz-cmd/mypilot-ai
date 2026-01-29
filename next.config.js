const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // 启用图片优化
    unoptimized: false,
  },

  // 生产环境优化
  swcMinify: true,
  compress: true,
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/en/admin',
        permanent: false,
      },
    ];
  },

  // Headers 配置（与 vercel.json 配合）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // 静态资源缓存
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 图片缓存
      {
        source: '/:path*.{jpg,jpeg,png,gif,webp,svg,ico}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack 配置
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // 生产环境优化
    if (!dev) {
      // 代码分割优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // 框架代码单独打包
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // 公共库单独打包
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                return `npm.${packageName.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // 公共组件单独打包
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },

  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['@heroicons/react'],
    
    // Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // 输出配置
  output: 'standalone',
}

module.exports = withNextIntl(nextConfig)
