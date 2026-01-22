import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
   private products = [
    { id: 1, name: 'iPhone 15', category: 'phone' },
    { id: 2, name: 'Samsung S24', category: 'phone' },
    { id: 3, name: 'MacBook Pro', category: 'laptop' },
  ];

  async create(product: any) {
    return {
      id: Date.now(),
      ...product,
    };
  }
  async findAll() {
    console.log('Query database...');
    return [
      { id: 1, name: 'iPhone 15' },
      { id: 2, name: 'Samsung S24' },
    ];
  }

  async findByCategory(category: string) {
    console.log('Query database...');
    return this.products.filter(
      (p) => p.category === category,
    );
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
