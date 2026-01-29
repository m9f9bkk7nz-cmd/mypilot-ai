/**
 * 应用配置管理
 * 集中管理所有环境变量和配置
 */

// 验证必需的环境变量
function validateEnv() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// 在非生产环境中验证
if (process.env.NODE_ENV !== 'production') {
  try {
    validateEnv();
  } catch (error) {
    console.warn('⚠️  Environment validation warning:', error);
  }
}

export const config = {
  // 应用信息
  app: {
    name: 'MyPilot',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
  },

  // 数据库
  database: {
    url: process.env.DATABASE_URL!,
  },

  // 认证
  auth: {
    url: process.env.NEXTAUTH_URL!,
    secret: process.env.NEXTAUTH_SECRET!,
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 支付
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // 邮件
  email: {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'MyPilot <noreply@example.com>',
  },

  // Redis（可选）
  redis: {
    url: process.env.REDIS_URL,
  },

  // AWS S3（可选）
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
  },

  // 外部 API
  externalApis: {
    exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY,
  },

  // 监控
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    posthogApiKey: process.env.POSTHOG_API_KEY,
  },

  // 功能开关
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
    enableGuestCheckout: process.env.ENABLE_GUEST_CHECKOUT !== 'false',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },

  // 安全
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
  },
} as const;

// 导出类型
export type Config = typeof config;

// 辅助函数：检查是否为生产环境
export const isProduction = () => config.app.env === 'production';

// 辅助函数：检查是否为开发环境
export const isDevelopment = () => config.app.env === 'development';

// 辅助函数：检查功能是否启用
export const isFeatureEnabled = (feature: keyof typeof config.features) => {
  return config.features[feature];
};
