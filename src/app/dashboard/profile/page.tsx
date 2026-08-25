'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from('profiles')
      .select('email, role, store_name')
      .eq('id', user.id)
      .single();

    if (data) {
      setEmail(data.email || '');
      setRole(data.role || 'buyer');
      setStoreName(data.store_name || '');
    }
  };

  const handleActivateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!storeName.trim()) {
      setMessage('Debes poner un nombre a tu tienda.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'seller',
        store_name: storeName.trim(),
      })
      .eq('id', userId);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('¡Tienda activada exitosamente! Ahora eres vendedor.');
      setRole('seller');
    }
  };

  const handleUpdateStoreName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || role !== 'seller') return;

    const { error } = await supabase
      .from('profiles')
      .update({ store_name: storeName.trim() })
      .eq('id', userId);

    if (error) {
      setMessage('Error al actualizar: ' + error.message);
    } else {
      setMessage('Nombre de tienda actualizado.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">Mi Perfil</h1>

      {message && (
        <div className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl font-bold text-xs shadow-2xs">
          {message}
        </div>
      )}

      {/* Información básica */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Información de la cuenta</h2>
        <p className="text-gray-600 dark:text-slate-300 text-sm"><strong>Email:</strong> {email}</p>
        <p className="text-gray-600 dark:text-slate-300 text-sm mt-2">
          <strong>Rol actual:</strong>{' '}
          <span className={role === 'seller' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-gray-500 dark:text-slate-400 font-bold'}>
            {role === 'seller' ? '✓ Vendedor' : '👤 Comprador'}
          </span>
        </p>
      </div>

      {/* Si es buyer: activarse como seller */}
      {role === 'buyer' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border-l-4 border-l-emerald-600 border-y border-r border-gray-200/90 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">¿Quieres vender en el marketplace?</h2>
          <p className="text-gray-600 dark:text-slate-300 text-xs mb-4">
            Activa tu cuenta de vendedor y configura el nombre de tu tienda.
          </p>
          <form onSubmit={handleActivateSeller} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                Nombre de tu tienda:
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ej: Tienda de David"
                required
                className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-xs"
            >
              Activar cuenta de vendedor
            </button>
          </form>
        </div>
      )}

      {/* Si ya es seller: editar nombre de tienda */}
      {role === 'seller' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border-l-4 border-l-indigo-600 border-y border-r border-gray-200/90 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Configuración de tu tienda</h2>
          <form onSubmit={handleUpdateStoreName} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                Nombre de tu tienda:
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-xs"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      )}
    </div>
  );
}