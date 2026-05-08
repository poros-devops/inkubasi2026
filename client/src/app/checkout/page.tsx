'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/src/store/cart.store';
import { useAuthStore } from '@/src/store/auth.store';
import api from '@/src/lib/api';
import { Check, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const f = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
  const subtotal = cart?.subtotal || 0;
  const discount =
    promoApplied && promoCode === 'MODERNO10' ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 500000 ? 0 : 25000;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    if (!user) router.push('/auth/login');
    else fetchCart();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', {
        shippingAddress: form,
        promoCode: promoApplied ? promoCode : undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-green-700" />
          </div>
          <h2 className="font-display text-3xl font-light text-[#1C1C1A] mb-3">
            Order Placed!
          </h2>
          <p className="text-sm text-[#888780] mb-8">
            Thank you for your purchase. We'll send a confirmation email
            shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/orders')}
              className="px-6 py-3 bg-[#1C1C1A] text-white rounded-full text-sm"
            >
              View Orders
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-[#E8E6DF] rounded-full text-sm text-[#888780]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
      <h1 className="font-display text-4xl font-light text-[#1C1C1A] mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Shipping form */}
          <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6">
            <h2 className="font-medium text-[#1C1C1A] mb-6">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'name',
                  label: 'Full Name',
                  placeholder: 'Your name',
                  col: 2,
                },
                {
                  name: 'phone',
                  label: 'Phone Number',
                  placeholder: '+62...',
                  col: 2,
                },
                {
                  name: 'address',
                  label: 'Street Address',
                  placeholder: 'Jl. ...',
                  col: 2,
                },
                {
                  name: 'city',
                  label: 'City',
                  placeholder: 'Surabaya',
                  col: 1,
                },
                {
                  name: 'province',
                  label: 'Province',
                  placeholder: 'Jawa Timur',
                  col: 1,
                },
                {
                  name: 'postalCode',
                  label: 'Postal Code',
                  placeholder: '60xxx',
                  col: 1,
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className={field.col === 2 ? 'md:col-span-2' : ''}
                >
                  <label className="text-xs text-[#888780] block mb-1.5">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm outline-none focus:border-[#888780] bg-[#FAFAF8] transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E8E6DF] rounded-2xl p-6">
              <h2 className="font-medium text-[#1C1C1A] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-14 bg-[#F1EFE8] rounded-lg flex-shrink-0 flex items-center justify-center">
                      <ShoppingBag size={14} className="text-[#C4C2BA]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#1C1C1A] leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#888780]">
                        {[item.size, item.color].filter(Boolean).join(' · ')} ×{' '}
                        {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-medium">
                      Rp{' '}
                      {(item.product.price * item.quantity).toLocaleString(
                        'id-ID'
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-4 pb-4 border-b border-[#E8E6DF]">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 border border-[#E8E6DF] rounded-lg text-xs outline-none focus:border-[#888780]"
                />
                <button
                  type="button"
                  onClick={() => setPromoApplied(promoCode === 'MODERNO10')}
                  className="px-3 py-2 border border-[#E8E6DF] rounded-lg text-xs text-[#888780] hover:border-[#888780] transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-700 mb-4">
                  ✓ Promo MODERNO10 applied!
                </p>
              )}

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#888780]">
                  <span>Subtotal</span>
                  <span>{f(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{f(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888780]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : f(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-[#1C1C1A] pt-2 border-t border-[#E8E6DF]">
                  <span>Total</span>
                  <span>{f(total)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !cart?.items.length}
              className="w-full bg-[#1C1C1A] text-white py-4 rounded-full text-sm font-medium hover:bg-[#2C2C2A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Placing order...' : `Place Order · ${f(total)}`}
            </button>

            <p className="text-xs text-center text-[#888780]">
              🔒 Secure checkout · COD & Transfer available
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
