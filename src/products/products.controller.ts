import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { RedisCacheInterceptor } from '../cache/cache.interceptor';
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
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    return this.productsService.findAll(
      Number(page),
      Number(limit),
    );
  }

  @Get('category/:category')
  @UseInterceptors(RedisCacheInterceptor)
  findByCategory(
    @Param('category') category: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    return this.productsService.findByCategory(
      category,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  create(@Body() body: any) {
    return this.productsService.create(body);
  }
}
