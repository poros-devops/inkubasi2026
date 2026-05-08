'use client';
import Link from 'next/link';
import { useCartStore } from '@/src/store/cart.store';
import { useAuthStore } from '@/src/store/auth.store';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { cart, toggleCart, fetchCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const itemCount = cart?.itemCount || 0;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-[#E8E6DF]' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-light tracking-[0.2em] text-[#1C1C1A]"
        >
          MODERNO
        </Link>

        {/* Nav Links - desktop */}
        <div className="hidden md:flex items-center gap-8">
          {['New Arrivals', 'Women', 'Men', 'Sale'].map((item) => (
            <Link
              key={item}
              href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-[#5F5E5A] hover:text-[#1C1C1A] tracking-wide transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 hover:bg-[#F1EFE8] rounded-full transition-colors"
          >
            <Search size={18} className="text-[#5F5E5A]" />
          </Link>

          {user ? (
            <div className="relative group">
              <button className="p-2 hover:bg-[#F1EFE8] rounded-full transition-colors">
                <User size={18} className="text-[#5F5E5A]" />
              </button>
              <div className="absolute right-0 top-10 w-44 bg-white border border-[#E8E6DF] rounded-xl shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-3 border-b border-[#E8E6DF]">
                  <p className="text-xs text-[#888780]">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user.name}</p>
                </div>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 text-sm text-[#5F5E5A] hover:bg-[#F1EFE8]"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/orders"
                  className="block px-4 py-2.5 text-sm text-[#5F5E5A] hover:bg-[#F1EFE8]"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2.5 text-sm text-[#A32D2D] hover:bg-[#F1EFE8] rounded-b-xl"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="p-2 hover:bg-[#F1EFE8] rounded-full transition-colors"
            >
              <User size={18} className="text-[#5F5E5A]" />
            </Link>
          )}

          <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-[#F1EFE8] rounded-full transition-colors"
          >
            <ShoppingBag size={18} className="text-[#5F5E5A]" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1C1C1A] text-[#FAFAF8] text-[9px] font-medium rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAFAF8] border-t border-[#E8E6DF] px-6 py-4 flex flex-col gap-4">
          {['New Arrivals', 'Women', 'Men', 'Sale'].map((item) => (
            <Link
              key={item}
              href={`/products?category=${item.toLowerCase()}`}
              className="text-sm text-[#5F5E5A]"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
