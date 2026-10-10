'use client';

import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

const SignOutButton = (): ReactElement => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignOut = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      aria-label={loading ? 'Cerrando sesión, por favor espere' : 'Cerrar sesión'}
      aria-busy={loading}
      aria-live="polite"
      aria-disabled={loading}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/20 transition duration-200 cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
      title="Cerrar sesión soberana"
    >
      {loading ? (
        <Loader2
          className="w-3.5 h-3.5 animate-spin"
          aria-hidden="true"
          focusable="false"
          role="presentation"
        />
      ) : (
        <LogOut
          className="w-3.5 h-3.5"
          aria-hidden="true"
          focusable="false"
          role="presentation"
        />
      )}
      <span aria-hidden="true">{loading ? 'Saliendo...' : 'Cerrar Sesión'}</span>
    </button>
  );
};

export default SignOutButton;