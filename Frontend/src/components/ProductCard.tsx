import { imageUrl } from '../api/client';
import type { Product, ProductStatus } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const statusStyles: Record<ProductStatus, string> = {
  disponible: 'bg-[#dceee3] text-[#1f5a3d]',
  agotado: 'bg-[#f8e1d7] text-[#8a3b1c]',
  descontinuado: 'bg-[#eceae4] text-[#5d6b64]',
};

function expirationLabel(date: string | null): { text: string; className: string } | null {
  if (!date) return null;
  const day = date.slice(0, 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(`${day}T00:00:00`);
  const diff = Math.ceil((exp.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return { text: `Vencido (${day})`, className: 'text-[#8a3b1c]' };
  if (diff <= 7) return { text: `Vence pronto: ${day}`, className: 'text-[#b45309]' };
  return { text: `Vence: ${day}`, className: 'text-[#5d6b64]' };
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const expiration = expirationLabel(product.expirationDate);

  return (
    <article className="overflow-hidden rounded-2xl border border-[#d9e2d6] bg-white shadow-sm">
      <img
        src={imageUrl(product.image)}
        alt={product.name}
        className="h-40 w-full object-cover bg-[#eef3ea]"
      />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-[#1f2a24]">{product.name}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[product.status]}`}>
            {product.status}
          </span>
        </div>
        <p className="text-xl font-semibold text-[#2f6b4f]">
          ${product.price.toFixed(2)}
        </p>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-[#5d6b64]">{product.description}</p>
        )}
        {expiration && (
          <p className={`mt-2 text-xs font-medium ${expiration.className}`}>{expiration.text}</p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded-full border border-[#2f6b4f] px-3 py-1 text-sm text-[#2f6b4f] hover:bg-[#eef3ea]"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="rounded-full px-3 py-1 text-sm text-[#8a3b1c] hover:bg-[#f8e1d7]"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
