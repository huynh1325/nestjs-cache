import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly PRODUCT_VERSION_KEY = 'products:version';

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

  async buildProductKey(options: {
    category?: string;
    page: string;
    limit: string;
  }) {
    const version = await this.getProductVersion();

    let key = `products:v${version}:page:${options.page}:limit:${options.limit}`;

    if (options.category) {
      key += `:category:${options.category}`;
    }

    return key;
  }

  async getProductVersion(): Promise<number> {
    const version = await this.cache.get<number>(this.PRODUCT_VERSION_KEY);

    if (version === undefined || version === null) {
      await this.cache.set(this.PRODUCT_VERSION_KEY, 1);
      return 1;
    }

    return version;
  }

  async increaseProductVersion(): Promise<number> {
    const current = await this.getProductVersion();
    const next = current + 1;
    await this.cache.set(this.PRODUCT_VERSION_KEY, next, 0);
    return next;
  }

}
