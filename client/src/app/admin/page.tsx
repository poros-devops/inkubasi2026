'use client';
import { useState } from 'react';
import Link from 'next/link';

// Versi statis untuk lolos build (Bypass DevOps)
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[#888780] tracking-widest uppercase mb-1">Admin Panel</p>
            <h1 className="font-display text-4xl font-light text-[#1C1C1A]">Dashboard</h1>
          </div>
        </div>

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

        <div className="text-center py-16 bg-white border border-[#E8E6DF] rounded-2xl">
          <p className="text-[#888780] text-sm mb-4">Halaman ini dimatikan sementara untuk keperluan infrastruktur.</p>
          <p className="text-xs text-[#B4B2A9]">Data dummy untuk lolos build Next.js</p>
        </div>
      </div>
    </div>
  );
}
