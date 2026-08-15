import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

export const config = Object.freeze({
  env,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim()),

  db: {
    url: process.env.DATABASE_URL || '',
  },

  auth: {
    accessSecret: isProduction ? required('JWT_ACCESS_SECRET') : (process.env.JWT_ACCESS_SECRET || 'dev-access-secret'),
    refreshSecret: isProduction ? required('JWT_REFRESH_SECRET') : (process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'),
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtlMs: Number(process.env.JWT_REFRESH_TTL_MS) || 7 * 24 * 60 * 60 * 1000,
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  },

  uploads: {
    maxBytes: Number(process.env.UPLOAD_MAX_BYTES) || 10 * 1024 * 1024,
    dir: process.env.UPLOAD_DIR || 'storage/documents',
    imagesDir: process.env.PROJECT_IMAGES_DIR || 'storage/project-images',
    imagesPublicPath: '/uploads/project-images',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_SECURE || 'false') === 'true', 
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com',
  },

  notifications: {
    maxAttempts: Number(process.env.NOTIFY_MAX_ATTEMPTS) || 5,
    batchSize: Number(process.env.NOTIFY_BATCH_SIZE) || 20,
  },

  llm: {
    apiKey: process.env.ANTHROPIC_API_KEY || '', // optional — enables quote drafting
    model: process.env.LLM_MODEL || 'claude-sonnet-4-5',
  },
  company: {
    name: process.env.COMPANY_NAME || 'Komaret Design & Construction Co',
    kraPin: process.env.COMPANY_KRA_PIN || '',
    address: process.env.COMPANY_ADDRESS || '',
    email: process.env.COMPANY_EMAIL || '',
    phone: process.env.COMPANY_PHONE || '',
    vatRatePct: Number(process.env.VAT_RATE_PCT) || 16,
  },
});

export default config;