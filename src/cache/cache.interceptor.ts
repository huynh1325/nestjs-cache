import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { params, query } = req;

    const page = query.page ?? '1';
    const limit = query.limit ?? '5';

    const key = this.cacheService.buildProductKey({
      category: params.category,
      page,
      limit,
    });

    const cached = await this.cacheService.get(key);
    if (cached) {
      console.log('Cache hit:', key);
      return of(cached);
    }

    console.log('Cache miss:', key);

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheService.set(key, data, 60);
        console.log('Cached:', key);
      }),
    );
  }
}
