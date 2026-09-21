import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FieldError, inputClass } from '../components/FieldError';
import { ApiError } from '../types';

export function RegisterPage() {
  const { token, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/products" replace />;

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio';
    else if (name.trim().length < 2) next.name = 'El nombre debe tener al menos 2 caracteres';
    if (!email.trim()) next.email = 'El email es obligatorio';
    else if (!email.includes('@')) next.email = 'Email inválido';
    if (!password) next.password = 'La contraseña es obligatoria';
    else if (password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres';
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
    setLoading(true);
    try {
      await register({ name, email, password });
    } catch (err) {
      if (err instanceof ApiError && err.field) {
        setFieldErrors({ [err.field]: err.message });
      } else {
        setError(err instanceof Error ? err.message : 'No se pudo registrar');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2f6b4f]">Fresco Market</p>
        <h1 className="font-display mt-1 text-3xl text-[#1f2a24]">Crear cuenta</h1>
        <p className="mb-5 text-sm text-[#5d6b64]">Regístrate para guardar tus productos.</p>

        {error && <p className="mb-3 rounded-lg bg-[#f8e1d7] px-3 py-2 text-sm text-[#8a3b1c]">{error}</p>}

        <label className="mb-3 block text-sm font-medium">
          Nombre
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((current) => ({ ...current, name: '' }));
            }}
            className={inputClass(Boolean(fieldErrors.name))}
          />
          <FieldError message={fieldErrors.name} />
        </label>
        <label className="mb-3 block text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((current) => ({ ...current, email: '' }));
            }}
            className={inputClass(Boolean(fieldErrors.email))}
          />
          <FieldError message={fieldErrors.email} />
        </label>
        <label className="mb-4 block text-sm font-medium">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((current) => ({ ...current, password: '' }));
            }}
            className={inputClass(Boolean(fieldErrors.password))}
          />
          <FieldError message={fieldErrors.password} />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#2f6b4f] py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Creando...' : 'Registrarme'}
        </button>
        <p className="mt-4 text-center text-sm text-[#5d6b64]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-[#2f6b4f]">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
