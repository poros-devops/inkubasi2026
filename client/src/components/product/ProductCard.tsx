'use client';
import { Product } from '@/src/types';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/src/store/cart.store';
import { useAuthStore } from '@/src/store/auth.store';
import { useRouter } from 'next/navigation';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const formatPrice = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, 1, product.sizes?.[0], product.colors?.[0]);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-[#F1EFE8] rounded-2xl overflow-hidden mb-3">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-[#C4C2BA]" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPct && (
            <span className="bg-[#F7C1C1] text-[#791F1F] text-[10px] font-medium px-2.5 py-1 rounded-full">
              -{discountPct}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#1C1C1A] text-[#FAFAF8] text-[10px] font-medium px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
          >
            <Heart
              size={14}
              className={
                wishlisted ? 'fill-[#A32D2D] text-[#A32D2D]' : 'text-[#888780]'
              }
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-[#1C1C1A] hover:text-white transition-colors"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs text-[#888780]">Out of Stock</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] text-[#888780] tracking-widest uppercase mb-1">
          {product.brand}
        </p>
        <p className="text-sm font-medium text-[#1C1C1A] mb-1.5">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#B4B2A9] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
