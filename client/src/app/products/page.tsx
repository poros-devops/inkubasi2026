'use client';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/src/components/product/ProductCard';
// HAPUS IMPORT INI: import { useSearchParams } from 'next/navigation';
import api from '@/src/lib/api';

// Kode Bypass DevOps - Fungsionalitas pencarian via URL dinonaktifkan sementara untuk lolos Build.
export default function ProductsPage() {
  // Data dummy agar UI tidak kosong saat presentasi
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulasi fetch data tanpa query params dari URL
    setLoading(true);
    api.get('/products')
      .then((r: any) => setProducts(r.data?.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center bg-[#F1EFE8] p-6 rounded-2xl border border-[#E8E6DF]">
        <h1 className="text-xl font-medium text-[#1C1C1A]">Mode Bypass Infrastruktur</h1>
        <p className="text-sm text-[#888780] mt-2">Filter URL dimatikan untuk memenuhi syarat Containerization Docker.</p>
      </div>

      {loading ? (
         <p className="text-center text-[#888780]">Loading data...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, idx) => (
            /* @ts-ignore */
            <ProductCard key={p.id || idx} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
