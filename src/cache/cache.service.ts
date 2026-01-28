import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get(key)) as T | null;
  }

  async set(key: string, value: any, ttlSeconds = 60) {
    await this.cache.set(key, value, ttlSeconds * 1000);
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  buildProductKey(options: {
    category?: string;
    page: string;
    limit: string;
  }) {
    let key = `products:page:${options.page}:limit:${options.limit}`;

    if (options.category) {
      key += `:category:${options.category}`;
    }

    return key;
  }
}
