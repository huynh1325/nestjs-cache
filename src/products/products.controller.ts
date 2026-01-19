import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { RedisCacheInterceptor } from '../cache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @UseInterceptors(RedisCacheInterceptor)
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    const product = await this.productsService.create(body);

    await this.cacheManager.del('cache:/products');

    return product;
  }
}
