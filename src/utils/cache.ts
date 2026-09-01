import NodeCache from 'node-cache';
import { config } from '../config/env';
import logger from './logger';

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttlSeconds,
      checkperiod: 120,
      useClones: true,
    });

    this.cache.on('expired', (key) => {
      logger.debug(`Cache expired: ${key}`);
    });
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value) {
      logger.debug(`Cache hit: ${key}`);
    } else {
      logger.debug(`Cache miss: ${key}`);
    }
    return value;
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    logger.debug(`Cache set: ${key}`);
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  getStats() {
    return this.cache.getStats();
  }
}

export const cacheService = new CacheService();
