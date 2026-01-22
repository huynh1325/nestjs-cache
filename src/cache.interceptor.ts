import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { params, query } = req;

    let key = 'products';

    if (params.category) {
      key += `:category:${params.category}`;
    }

    // if (query.keyword) {
    //   key += `:search:${query.keyword}`;
    // }

    const cached = await this.cacheManager.get(key);
    if (cached) {
      console.log('Return from cache');
      return of(cached);
    }

    console.log('Cache miss, go to controller');

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheManager.set(key, data, 60_000);
        console.log('Cached:', key);
      }),
    );
  }
}
