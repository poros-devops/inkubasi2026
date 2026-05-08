import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column()
  userId: string;

  @Column('jsonb')
  items: Array<{
    productId: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }>;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  shippingCost: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('jsonb')
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };

  @Column({ nullable: true })
  promoCode: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
