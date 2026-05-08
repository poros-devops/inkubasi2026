import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-[#F1EFE8] rounded w-1/4 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#F1EFE8] rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
