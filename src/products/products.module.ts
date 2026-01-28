import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AppCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [AppCacheModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
