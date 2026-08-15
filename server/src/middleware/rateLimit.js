
import rateLimit from 'express-rate-limit';

export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: 429, message: 'Too many attempts. Try again later.', code: 'RATE_LIMITED' },
});

export const contactRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });
