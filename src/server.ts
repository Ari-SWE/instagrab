import express from 'express';
import helmet from 'helmet';
import { config } from './config/env';
import { configureCors } from './middleware/cors';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { createRouter } from './routes';
import { InstagramService } from './services/instagramService';
import { WebsiteInstagramDataProvider } from './providers/websiteInstagramDataProvider';
import logger from './utils/logger';

async function main() {
  const app = express();

  // ── Middleware ──
  app.use(helmet());
  app.use(configureCors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/api', apiRateLimiter);

  // ── Service Setup ──
  const provider = new WebsiteInstagramDataProvider();
  const service = new InstagramService(provider);

  // ── Routes ──
  app.use('/api', createRouter(service));

  // ── Error Handler (must be last) ──
  app.use(errorHandler);

  // ── Start Server ──
  const server = app.listen(config.port, () => {
    logger.info(`🚀 InstaGrab API running on port ${config.port}`);
    logger.info(`   Environment: ${config.nodeEnv}`);
    logger.info(`   Upstream:    ${config.upstream.baseUrl}`);
  });

  // ── Graceful Shutdown ──
  const shutdown = async () => {
    logger.info('Shutting down...');
    server.close();
    await provider.destroy();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
