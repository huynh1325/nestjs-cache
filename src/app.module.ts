import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // 60 giây
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
