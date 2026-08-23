'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Profile = {
  id: string;
  email: string;
  role: string;
  store_name: string | null;
  is_admin: boolean;
  is_blocked: boolean;
};

type Metrics = {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      router.push('/dashboard');
      return;
    }

    loadMetrics();
    loadUsers();
  };

  const loadMetrics = async () => {
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: sellersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller');
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    
    const { data: ordersData } = await supabase.from('orders').select('total_amount');
    const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    setMetrics({
      totalUsers: usersCount || 0,
      totalSellers: sellersCount || 0,
      totalProducts: productsCount || 0,
      totalOrders: ordersCount || 0,
      totalRevenue,
    });
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, role, store_name, is_admin, is_blocked')
      .order('created_at', { ascending: false });
    setUsers(data || []);
  };

  const toggleBlockUser = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: !currentStatus })
      .eq('id', userId);

    if (error) {
      alert('Error al actualizar usuario');
    } else {
      loadUsers(); // Recargar la lista
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando panel de administración...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Super Administrador</h1>

      {/* Métricas de la Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard title="Usuarios Totales" value={metrics!.totalUsers} color="bg-blue-500" />
        <MetricCard title="Vendedores" value={metrics!.totalSellers} color="bg-indigo-500" />
        <MetricCard title="Productos" value={metrics!.totalProducts} color="bg-purple-500" />
        <MetricCard title="Órdenes" value={metrics!.totalOrders} color="bg-green-500" />
        <MetricCard title="Ingresos Totales" value={`$${metrics!.totalRevenue.toLocaleString()}`} color="bg-yellow-500" />
      </div>

      {/* Gestión de Usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios y Tiendas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Tienda</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.store_name || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_admin ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_admin ? 'Admin' : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_blocked ? 'Bloqueado' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {!user.is_admin && (
                      <button
                        onClick={() => toggleBlockUser(user.id, user.is_blocked)}
                        className={`px-3 py-1 rounded text-xs font-medium transition ${
                          user.is_blocked 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className={`${color} text-white p-6 rounded-lg shadow-md`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}