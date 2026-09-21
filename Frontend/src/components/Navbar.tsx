import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[#d9e2d6] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/products" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f6b4f] text-sm font-bold text-white">
            FS
          </span>
          <div>
            <p className="font-display text-lg leading-none text-[#1f2a24]">Fresco Market</p>
            <p className="text-xs text-[#5d6b64]">Inventario de supermercado</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-[#5d6b64] sm:block">{user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[#2f6b4f] px-4 py-1.5 font-medium text-[#2f6b4f] hover:bg-[#2f6b4f] hover:text-white"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
