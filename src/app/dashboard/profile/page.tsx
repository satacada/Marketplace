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

    // Actualizar rol a 'seller' y guardar el nombre de la tienda
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded">{message}</div>
        )}

        {/* Información básica */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Información de la cuenta</h2>
          <p className="text-gray-600"><strong>Email:</strong> {email}</p>
          <p className="text-gray-600 mt-2">
            <strong>Rol actual:</strong>{' '}
            <span className={role === 'seller' ? 'text-green-600 font-bold' : 'text-gray-500'}>
              {role === 'seller' ? 'Vendedor' : 'Comprador'}
            </span>
          </p>
        </div>

        {/* Si es buyer: activarse como seller */}
        {role === 'buyer' && (
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-xl font-semibold mb-2">¿Quieres vender en el marketplace?</h2>
            <p className="text-gray-600 mb-4">
              Activa tu cuenta de vendedor y configura el nombre de tu tienda.
            </p>
            <form onSubmit={handleActivateSeller} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de tu tienda:
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ej: Tienda de David"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Activar cuenta de vendedor
              </button>
            </form>
          </div>
        )}

        {/* Si ya es seller: editar nombre de tienda */}
        {role === 'seller' && (
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold mb-4">Configuración de tu tienda</h2>
            <form onSubmit={handleUpdateStoreName} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de tu tienda:
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}