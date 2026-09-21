import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#b7c7b2] bg-white/70 px-6 py-16 text-center">
        <p className="font-display text-2xl text-[#1f2a24]">El pasillo está vacío</p>
        <p className="mt-2 text-[#5d6b64]">Agrega el primer producto de tu supermercado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
