'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import { Product } from '@/src/types';
import { useCartStore } from '@/src/store/cart.store';
import { useAuthStore } from '@/src/store/auth.store';
import { ShoppingBag, Heart, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      setProduct(r.data);
      setSelectedSize(r.data.sizes?.[0] || '');
      setSelectedColor(r.data.colors?.[0] || '');
    });
  }, [id]);

  const formatPrice = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
  const discount = product?.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setAdding(true);
    await addItem(product!.id, qty, selectedSize, selectedColor);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product)
    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-[#F1EFE8] rounded-3xl" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-[#F1EFE8] rounded w-1/4" />
            <div className="h-8 bg-[#F1EFE8] rounded w-3/4" />
            <div className="h-6 bg-[#F1EFE8] rounded w-1/3" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-[#888780] hover:text-[#1C1C1A] mb-8"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] bg-[#F1EFE8] rounded-3xl overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={48} className="text-[#C4C2BA]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-4">
          <p className="text-xs text-[#888780] tracking-widest uppercase mb-3">
            {product.brand}
          </p>
          <h1 className="font-display text-4xl font-light text-[#1C1C1A] mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-medium">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-[#B4B2A9] line-through text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-[#F7C1C1] text-[#791F1F] text-xs px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-[#5F5E5A] leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-[#1C1C1A] mb-3 tracking-wide">
                SIZE — {selectedSize}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-lg text-sm border transition-colors ${
                      selectedSize === s
                        ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                        : 'border-[#E8E6DF] text-[#5F5E5A] hover:border-[#888780]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-medium text-[#1C1C1A] mb-3 tracking-wide">
                COLOR — {selectedColor}
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    title={c}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c
                        ? 'border-[#1C1C1A] scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3 border border-[#E8E6DF] rounded-full px-4 py-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="text-[#888780] hover:text-[#1C1C1A] text-lg leading-none"
              >
                −
              </button>
              <span className="text-sm font-medium w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="text-[#888780] hover:text-[#1C1C1A] text-lg leading-none"
              >
                +
              </button>
            </div>
            <p className="text-xs text-[#888780]">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`flex-1 py-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                added
                  ? 'bg-green-700 text-white'
                  : 'bg-[#1C1C1A] text-white hover:bg-[#2C2C2A]'
              } disabled:opacity-50`}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Cart
                </>
              ) : adding ? (
                'Adding...'
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to Cart
                </>
              )}
            </button>
            <button className="w-14 h-14 border border-[#E8E6DF] rounded-full flex items-center justify-center hover:bg-[#F1EFE8] transition-colors">
              <Heart size={18} className="text-[#888780]" />
            </button>
          </div>

          {/* Shipping note */}
          <p className="text-xs text-[#888780] mt-6 pb-6 border-b border-[#E8E6DF]">
            Free shipping on orders above Rp 500.000 · Easy 30-day returns
          </p>
        </div>
      </div>
    </div>
  );
}
