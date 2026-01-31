import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  private products = [
    { id: 1, name: 'iPhone 15', category: 'phone' },
    { id: 2, name: 'Samsung S24', category: 'phone' },
    { id: 3, name: 'Xiaomi 14', category: 'phone' },
    { id: 4, name: 'Pixel 8', category: 'phone' },
    { id: 5, name: 'MacBook Pro', category: 'laptop' },
    { id: 6, name: 'Dell XPS', category: 'laptop' },
    { id: 7, name: 'HP Spectre', category: 'laptop' },
    { id: 8, name: 'Asus Zenbook', category: 'laptop' },
  ];

  async create(body: any) {
    const newProduct = {
      id: this.products.length + 1,
      ...body,
    };

    this.products.push(newProduct);

    console.log('Product created:', newProduct);

    await this.cacheService.increaseProductVersion();

    return newProduct;
  }

  
  async findAll(page: number, limit: number) {
    console.log('Query database: findAll');

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      page,
      limit,
      total: this.products.length,
      data: this.products.slice(start, end),
    };
  }

  async findByCategory(
    category: string,
    page: number,
    limit: number,
  ) {
    console.log(
      `Query database: findByCategory(${category})`,
    );

    const filtered = this.products.filter(
      (p) => p.category === category,
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      category,
      page,
      limit,
      total: filtered.length,
      data: filtered.slice(start, end),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
