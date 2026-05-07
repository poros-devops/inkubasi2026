'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth.store';
import api from '@/src/lib/api';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FAEEDA] text-[#633806]',
  confirmed: 'bg-[#E6F1FB] text-[#0C447C]',
  shipped: 'bg-[#EAF3DE] text-[#27500A]',
  delivered: 'bg-[#EAF3DE] text-[#27500A]',
  cancelled: 'bg-[#FCEBEB] text-[#791F1F]',
};

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/orders'),
    ]).then(([d, o]) => {
      setDashboard(d.data);
      setOrders(o.data.items || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const f = (n: number) => `Rp ${Number(n).toLocaleString('id-ID')}`;

  const handleStatusChange = async (orderId: string, status: string) => {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  if (loading) return (
    <div className="pt-24 px-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 bg-[#F1EFE8] rounded w-48 mb-4" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#F1EFE8] rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[#888780] tracking-widest uppercase mb-1">Admin Panel</p>
            <h1 className="font-display text-4xl font-light text-[#1C1C1A]">Dashboard</h1>
          </div>
          <Link href="/products/new" className="hidden text-sm bg-[#1C1C1A] text-white px-5 py-2.5 rounded-full hover:bg-[#2C2C2A] transition-colors">
            + Add Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-[#E8E6DF]">
          {(['overview', 'orders', 'products'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-[#1C1C1A] text-[#1C1C1A] font-medium'
                  : 'border-transparent text-[#888780] hover:text-[#1C1C1A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && dashboard && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Revenue', value: f(dashboard.revenue?.total || 0), sub: `${dashboard.revenue?.count || 0} orders` },
                { label: 'Total Orders', value: dashboard.orderCount?.toLocaleString(), sub: 'All time' },
                { label: 'Products', value: dashboard.productCount?.toLocaleString(), sub: 'Active' },
                { label: 'Customers', value: dashboard.customerCount?.toLocaleString(), sub: 'Registered' },
              ].map((s) => (
                <div key={s.label} className="bg-[#F1EFE8] rounded-2xl p-5">
                  <p className="text-xs text-[#888780] mb-2">{s.label}</p>
                  <p className="text-xl font-medium text-[#1C1C1A]">{s.value}</p>
                  <p className="text-xs text-[#888780] mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent orders preview */}
            <div className="bg-white border border-[#E8E6DF] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8E6DF] flex justify-between items-center">
                <h2 className="font-medium text-sm">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-[#888780] hover:text-[#1C1C1A]">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#E8E6DF]">
                    {['Order', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs text-[#888780] font-normal">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="border-b border-[#E8E6DF] last:border-0 hover:bg-[#FAFAF8]">
                        <td className="px-6 py-4 font-medium text-xs">#{o.orderNumber}</td>
                        <td className="px-6 py-4 text-xs text-[#5F5E5A]">{o.user?.name || '—'}</td>
                        <td className="px-6 py-4 text-xs">{f(o.total)}</td>
                        <td className="px-6 py-4"><span className={`text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span></td>
                        <td className="px-6 py-4 text-xs text-[#888780]">{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E8E6DF] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E6DF]">
              <h2 className="font-medium text-sm">All Orders <span className="text-[#888780] font-normal">({orders.length})</span></h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#E8E6DF]">
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs text-[#888780] font-normal">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-[#E8E6DF] last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-6 py-4 font-medium text-xs text-[#1C1C1A]">#{o.orderNumber}</td>
                      <td className="px-6 py-4 text-xs text-[#5F5E5A]">{o.user?.name || '—'}</td>
                      <td className="px-6 py-4 text-xs text-[#888780]">{o.items?.length || 0} item(s)</td>
                      <td className="px-6 py-4 text-xs font-medium">{f(o.total)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-[10px] font-medium px-2.5 py-1 rounded-full capitalize border-0 outline-none cursor-pointer ${STATUS_STYLES[o.status]}`}
                        >
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#888780]">{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="text-center py-16 bg-white border border-[#E8E6DF] rounded-2xl">
            <p className="text-[#888780] text-sm mb-4">Product management via API.</p>
            <p className="text-xs text-[#B4B2A9]">Use POST /api/products to add products.</p>
          </div>
        )}
      </div>
    </div>
  );
}
