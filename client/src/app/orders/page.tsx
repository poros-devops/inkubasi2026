'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth.store';
import api from '@/src/lib/api';
import { Order } from '@/src/types';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FAEEDA] text-[#633806]',
  confirmed: 'bg-[#E6F1FB] text-[#0C447C]',
  shipped: 'bg-[#EAF3DE] text-[#27500A]',
  delivered: 'bg-[#EAF3DE] text-[#27500A]',
  cancelled: 'bg-[#FCEBEB] text-[#791F1F]',
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    api
      .get('/orders')
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  const f = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <p className="text-xs text-[#888780] tracking-widest uppercase mb-2">
        Account
      </p>
      <h1 className="font-display text-4xl font-light text-[#1C1C1A] mb-8">
        My Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-[#F1EFE8] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[#888780] mb-4">No orders yet.</p>
          <button
            onClick={() => router.push('/products')}
            className="text-sm font-medium underline underline-offset-4"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#E8E6DF] rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium text-sm text-[#1C1C1A]">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-[#888780] mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#5F5E5A]">
                      {item.name}{' '}
                      <span className="text-[#B4B2A9]">× {item.quantity}</span>
                    </span>
                    <span className="text-[#1C1C1A]">
                      {f(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#E8E6DF]">
                <div className="text-xs text-[#888780]">
                  Ship to: {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province}
                </div>
                <div className="font-medium text-sm">{f(order.total)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
