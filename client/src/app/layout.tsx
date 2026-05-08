import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/src/components/layout/Navbar';
import { CartDrawer } from '@/src/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'MODERNO — Fashion & Apparel',
  description: 'Timeless style, modern fit.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
      </body>
    </html>
  );
}
