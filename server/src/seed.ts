import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product, ProductCategory } from './products/product.entity';
import { User, UserRole } from './users/user.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productRepo = app.get(getRepositoryToken(Product));
  const userRepo = app.get(getRepositoryToken(User));

  // Seed admin user
  const existing = await userRepo.findOne({ where: { email: 'admin@moderno.com' } });
  if (!existing) {
    const admin = userRepo.create({
      email: 'admin@moderno.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin Moderno',
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✅ Admin created: admin@moderno.com / admin123');
  }

  // Seed products
  const count = await productRepo.count();
  if (count === 0) {
    const products = [
      {
        name: 'Linen Blazer',
        brand: 'ESSENTIAL',
        description:
          'A timeless linen blazer crafted from premium European linen. Perfect for both formal and casual occasions, this versatile piece features a relaxed silhouette with structured shoulders.',
        price: 890000,
        originalPrice: null,
        category: ProductCategory.WOMEN,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['#F5F0E8', '#D3D1C7', '#2C2C2A'],
        images: [],
        stock: 50,
        isFeatured: true,
      },
      {
        name: 'Silk Midi Dress',
        brand: 'MODERNO',
        description:
          'Luxurious silk midi dress with a fluid drape that moves beautifully. Features a subtle wrap silhouette with adjustable tie waist for a flattering fit.',
        price: 650000,
        originalPrice: 850000,
        category: ProductCategory.WOMEN,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['#8FAF8A', '#C4A882', '#E8D5C4'],
        images: [],
        stock: 30,
        isFeatured: true,
      },
      {
        name: 'Classic Hoodie',
        brand: 'URBAN',
        description:
          'Heavyweight French terry hoodie with a relaxed fit. Features a kangaroo pocket and adjustable drawstring hood. Garment-dyed for a unique lived-in look.',
        price: 520000,
        originalPrice: null,
        category: ProductCategory.MEN,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['#1C3A5E', '#2C2C2A', '#8B8682'],
        images: [],
        stock: 80,
        isFeatured: true,
      },
      {
        name: 'Cargo Pants',
        brand: 'ESSENTIAL',
        description:
          'Modern cargo pants in a relaxed tapered fit. Crafted from durable ripstop cotton with six functional pockets and an adjustable waistband.',
        price: 475000,
        originalPrice: 600000,
        category: ProductCategory.MEN,
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['#5C6B4E', '#C4B99A', '#2C2C2A'],
        images: [],
        stock: 40,
        isFeatured: true,
      },
      {
        name: 'Oversized Trench Coat',
        brand: 'MODERNO',
        description:
          'A contemporary take on the classic trench. Crafted from water-resistant cotton gabardine with an oversized silhouette and storm flap detail.',
        price: 1450000,
        originalPrice: 1800000,
        category: ProductCategory.WOMEN,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['#C4B99A', '#2C2C2A'],
        images: [],
        stock: 20,
        isFeatured: false,
      },
      {
        name: 'Merino Wool Sweater',
        brand: 'ESSENTIAL',
        description:
          'Ultra-soft merino wool sweater in a classic crew neck silhouette. Naturally temperature-regulating and wrinkle-resistant for all-day comfort.',
        price: 720000,
        originalPrice: null,
        category: ProductCategory.MEN,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#8B8682', '#C4B99A', '#1C3A5E'],
        images: [],
        stock: 35,
        isFeatured: false,
      },
      {
        name: 'Wide Leg Trousers',
        brand: 'MODERNO',
        description:
          'Elegant wide-leg trousers in fluid crepe fabric. High-waisted with a straight wide leg and invisible side zip for a clean, polished look.',
        price: 580000,
        originalPrice: 750000,
        category: ProductCategory.WOMEN,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['#1C1C1A', '#F5F0E8', '#8FAF8A'],
        images: [],
        stock: 25,
        isFeatured: false,
      },
      {
        name: 'Canvas Tote Bag',
        brand: 'MODERNO',
        description:
          'Heavy-weight canvas tote with reinforced handles. Features an interior zip pocket and subtle MODERNO stamp. The perfect everyday companion.',
        price: 280000,
        originalPrice: null,
        category: ProductCategory.ACCESSORIES,
        sizes: ['ONE SIZE'],
        colors: ['#F5F0E8', '#2C2C2A'],
        images: [],
        stock: 100,
        isFeatured: false,
      },
      {
        name: 'Linen Shirt',
        brand: 'ESSENTIAL',
        description:
          'Relaxed-fit linen shirt with a classic collar and button placket. Stonewashed for extra softness with a natural texture that gets better with wear.',
        price: 390000,
        originalPrice: 520000,
        category: ProductCategory.SALE,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#E8D5C4', '#8FAF8A', '#F5F0E8'],
        images: [],
        stock: 15,
        isFeatured: false,
      },
      {
        name: 'Ribbed Tank Top',
        brand: 'URBAN',
        description:
          'Soft ribbed cotton tank with a fitted silhouette. A wardrobe essential that layers perfectly under blazers or stands alone for a minimal look.',
        price: 185000,
        originalPrice: 250000,
        category: ProductCategory.SALE,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['#F5F0E8', '#1C1C1A', '#C4B99A'],
        images: [],
        stock: 60,
        isFeatured: false,
      },
      {
        name: 'Leather Card Holder',
        brand: 'MODERNO',
        description:
          'Slim vegetable-tanned leather card holder with four card slots and a central bill compartment. Develops a beautiful patina over time.',
        price: 320000,
        originalPrice: null,
        category: ProductCategory.ACCESSORIES,
        sizes: ['ONE SIZE'],
        colors: ['#8B6914', '#2C2C2A'],
        images: [],
        stock: 45,
        isFeatured: false,
      },
      {
        name: 'Relaxed Denim Jacket',
        brand: 'URBAN',
        description:
          'Classic denim jacket in a relaxed boxy fit. Made from 100% organic cotton denim, lightly washed for a vintage feel.',
        price: 680000,
        originalPrice: null,
        category: ProductCategory.MEN,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#6B8CAE', '#2C2C2A'],
        images: [],
        stock: 28,
        isFeatured: false,
      },
    ];

    await productRepo.save(products.map((p) => productRepo.create(p)));
    console.log(`✅ ${products.length} products seeded`);
  }

  console.log('🌱 Seeding complete!');
  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
