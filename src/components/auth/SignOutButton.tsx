'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

const SignOutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
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
      onClick={handleSignOut} 
      disabled={loading}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/20 transition duration-200 cursor-pointer disabled:opacity-50"
      title="Cerrar sesión soberana"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
      <span>{loading ? 'Saliendo...' : 'Cerrar Sesión'}</span>
    </button>
  );
};

export default SignOutButton;