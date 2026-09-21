import { useState, type ChangeEvent, type FormEvent } from 'react';
import { api, imageUrl } from '../api/client';
import { FieldError, inputClass } from './FieldError';
import { ApiError, type Product, type ProductStatus } from '../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const STATUSES: ProductStatus[] = ['disponible', 'agotado', 'descontinuado'];
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function toDateInput(value: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'disponible');
  const [description, setDescription] = useState(product?.description ?? '');
  const [hasExpiration, setHasExpiration] = useState(Boolean(product?.expirationDate));
  const [expirationDate, setExpirationDate] = useState(toDateInput(product?.expirationDate ?? null));
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product ? imageUrl(product.image) : null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function clearField(field: string) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setImage(null);
      return;
    }

    if (!ALLOWED_IMAGES.includes(file.type)) {
      setImage(null);
      setPreview(product ? imageUrl(product.image) : null);
      event.target.value = '';
      setFieldErrors((current) => ({
        ...current,
        image: 'Solo se permiten imágenes JPG, PNG o WEBP',
      }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImage(null);
      event.target.value = '';
      setFieldErrors((current) => ({
        ...current,
        image: 'La imagen no puede superar 5 MB',
      }));
      return;
    }

    clearField('image');
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = 'El nombre es obligatorio';
    else if (name.trim().length < 2) next.name = 'El nombre debe tener al menos 2 caracteres';

    if (!isEdit && !image) next.image = 'La imagen del producto es requerida';

    if (!price) next.price = 'El precio es obligatorio';
    else if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      next.price = 'El precio debe ser mayor a 0';
    }

    if (!status) next.status = 'El estado es obligatorio';

    if (hasExpiration && !expirationDate) {
      next.expirationDate = 'Indica la fecha de vencimiento';
    }

    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const localErrors = validate();
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);

    try {
      const form = new FormData();
      form.append('name', name.trim());
      form.append('price', price);
      form.append('status', status);
      form.append('description', description.trim());
      form.append('hasExpiration', String(hasExpiration));
      if (hasExpiration) {
        form.append('expirationDate', expirationDate);
      }
      if (image) {
        form.append('image', image);
      }

      if (isEdit && product) {
        await api(`/api/products/${product.id}`, { method: 'PUT', body: form });
      } else {
        await api('/api/products', { method: 'POST', body: form });
      }

      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.field) {
        setFieldErrors({ [err.field]: err.message });
      } else {
        setError(err instanceof Error ? err.message : 'No se pudo guardar');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-[#1f2a24]/45 p-4 sm:items-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-lg rounded-2xl bg-[#fffdf8] p-5 shadow-xl"
      >
        <h2 className="font-display text-2xl text-[#1f2a24]">
          {isEdit ? 'Editar producto' : 'Nuevo producto'}
        </h2>
        <p className="mb-4 text-sm text-[#5d6b64]">Completa los datos del inventario.</p>

        {error && (
          <p className="mb-3 rounded-lg bg-[#f8e1d7] px-3 py-2 text-sm text-[#8a3b1c]">{error}</p>
        )}

        <label className="mb-3 block text-sm font-medium text-[#1f2a24]">
          Nombre
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearField('name');
            }}
            className={inputClass(Boolean(fieldErrors.name))}
          />
          <FieldError message={fieldErrors.name} />
        </label>

        <div className="mb-3">
          <p className="text-sm font-medium text-[#1f2a24]">
            Imagen {isEdit ? '(opcional al editar)' : ''}
          </p>
          <input
            id="product-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="sr-only"
          />
          <label
            htmlFor="product-image"
            className={`mt-1 flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2 ${
              fieldErrors.image ? 'border-[#c45c26]' : 'border-[#d9e2d6] hover:border-[#2f6b4f]'
            }`}
          >
            <span className="shrink-0 rounded-full bg-[#2f6b4f] px-4 py-1.5 text-sm font-semibold text-white">
              Elegir imagen
            </span>
            <span className="truncate text-sm text-[#5d6b64]">
              {image?.name || (isEdit ? 'Mantener imagen actual' : 'Ningún archivo seleccionado')}
            </span>
          </label>
          <FieldError message={fieldErrors.image} />
        </div>

        {preview && (
          <img src={preview} alt="Vista previa" className="mb-3 h-32 w-full rounded-lg object-cover" />
        )}

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-[#1f2a24]">
            Precio
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                clearField('price');
              }}
              className={inputClass(Boolean(fieldErrors.price))}
            />
            <FieldError message={fieldErrors.price} />
          </label>
          <label className="block text-sm font-medium text-[#1f2a24]">
            Estado
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ProductStatus);
                clearField('status');
              }}
              className={inputClass(Boolean(fieldErrors.status))}
            >
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.status} />
          </label>
        </div>

        <label className="mb-3 flex items-center gap-2 text-sm font-medium text-[#1f2a24]">
          <input
            type="checkbox"
            checked={hasExpiration}
            onChange={(e) => {
              setHasExpiration(e.target.checked);
              clearField('expirationDate');
            }}
          />
          Tiene fecha de vencimiento
        </label>

        {hasExpiration && (
          <label className="mb-3 block text-sm font-medium text-[#1f2a24]">
            Fecha de vencimiento
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e.target.value);
                clearField('expirationDate');
              }}
              className={inputClass(Boolean(fieldErrors.expirationDate))}
            />
            <FieldError message={fieldErrors.expirationDate} />
          </label>
        )}

        <label className="mb-4 block text-sm font-medium text-[#1f2a24]">
          Descripción (opcional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass(false)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm text-[#5d6b64] hover:bg-[#eef3ea]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#2f6b4f] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
