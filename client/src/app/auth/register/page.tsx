'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth.store';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, name);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex">
      <div className="hidden md:flex flex-col justify-end w-1/2 bg-[#F1EFE8] p-16">
        <p className="text-xs text-[#888780] tracking-[0.25em] uppercase mb-4">
          MODERNO
        </p>
        <h2 className="font-display text-5xl font-light text-[#1C1C1A] leading-tight">
          Join the
          <br />
          community.
        </h2>
        <p className="text-sm text-[#888780] mt-4 max-w-xs">
          Create an account and enjoy exclusive access to new collections and
          member-only offers.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-light text-[#1C1C1A] mb-2">
            Create account
          </h1>
          <p className="text-sm text-[#888780] mb-8">Join MODERNO today</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-[#FCEBEB] border border-[#F7C1C1] rounded-xl text-sm text-[#791F1F]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#888780] block mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm outline-none focus:border-[#888780] bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#888780] block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
                className="w-full px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm outline-none focus:border-[#888780] bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#888780] block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                minLength={6}
                className="w-full px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm outline-none focus:border-[#888780] bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1C1C1A] text-[#FAFAF8] py-3.5 rounded-full text-sm font-medium hover:bg-[#2C2C2A] transition-colors disabled:opacity-60 mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#888780] mt-6">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-[#1C1C1A] font-medium hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
