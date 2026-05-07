'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/src/lib/api';
import { Product, PaginatedResponse } from '@/src/types';
import { ProductCard } from '@/src/components/product/ProductCard';
import { Search } from 'lucide-react';

const CATEGORIES = ['all', 'women', 'men', 'accessories', 'sale'];

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { page, limit: 12, sort };
    if (category !== 'all') params.category = category;
    if (search) params.search = search;

    api.get<PaginatedResponse<Product>>('/products', { params })
      .then((r) => { setProducts(r.data.items); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      {/* Paste your existing JSX here (Header, Filters, Grid, Pagination) */}
    </div>
  );
}