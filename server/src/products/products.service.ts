import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Product, ProductCategory } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll(query: { category?: ProductCategory; search?: string; page?: number; limit?: number; sort?: string }) {
    const { category, search, page = 1, limit = 12, sort = 'createdAt' } = query;
    const options: FindManyOptions<Product> = {
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: 'DESC' },
    };
    if (category) options.where = { ...(options.where as object), category };
    if (search) options.where = { ...(options.where as object), name: Like(`%${search}%`) };
    const [items, total] = await this.productRepo.findAndCount(options);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<Product> {
    const p = await this.productRepo.findOne({ where: { id, isActive: true } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async findFeatured(): Promise<Product[]> {
    return this.productRepo.find({ where: { isFeatured: true, isActive: true }, take: 8 });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await this.productRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.update(id, { isActive: false });
  }

  async count(): Promise<number> {
    return this.productRepo.count({ where: { isActive: true } });
  }
}
