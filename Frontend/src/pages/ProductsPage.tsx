import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Navbar } from '../components/Navbar';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';
import type { Product } from '../types';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  async function loadProducts() {
    setError('');
    try {
      const data = await api<Product[]>('/api/products');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  async function handleDelete(product: Product) {
    const ok = window.confirm(`¿Eliminar "${product.name}"?`);
    if (!ok) return;

    try {
      await api(`/api/products/${product.id}`, { method: 'DELETE' });
      setMessage(`Se eliminó ${product.name}`);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  }

  function handleSaved() {
    setFormOpen(false);
    setEditing(null);
    setMessage(editing ? 'Producto actualizado' : 'Producto creado');
    loadProducts();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-[#1f2a24]">Productos</h1>
            <p className="text-sm text-[#5d6b64]">Administra el inventario de tu supermercado.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-[#2f6b4f] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Nuevo producto
          </button>
        </div>

        {message && (
          <p className="mb-4 rounded-lg bg-[#dceee3] px-3 py-2 text-sm text-[#1f5a3d]">{message}</p>
        )}
        {error && (
          <p className="mb-4 rounded-lg bg-[#f8e1d7] px-3 py-2 text-sm text-[#8a3b1c]">{error}</p>
        )}

        {loading ? (
          <p className="text-[#5d6b64]">Cargando inventario...</p>
        ) : (
          <ProductList products={products} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </main>

      {formOpen && (
        <ProductForm
          product={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
