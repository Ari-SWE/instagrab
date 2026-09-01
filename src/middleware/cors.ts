import cors from 'cors';
import { config } from '../config/env';

export function configureCors() {
  const origins = config.cors.allowedOrigins;

  if (origins === '*') {
    return cors();
  }

  const allowedOrigins = origins.split(',').map((o) => o.trim());
  return cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
}
