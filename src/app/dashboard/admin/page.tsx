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

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-slate-400 font-bold">Cargando panel de administración...</div>;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">Panel de Super Administrador</h1>

      {/* Métricas de la Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Usuarios Totales" value={metrics!.totalUsers} color="bg-blue-600" />
        <MetricCard title="Vendedores" value={metrics!.totalSellers} color="bg-indigo-600" />
        <MetricCard title="Productos" value={metrics!.totalProducts} color="bg-purple-600" />
        <MetricCard title="Órdenes" value={metrics!.totalOrders} color="bg-emerald-600" />
        <MetricCard title="Ingresos Totales" value={`$${metrics!.totalRevenue.toLocaleString()}`} color="bg-amber-600" />
      </div>

      {/* Gestión de Usuarios */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">Gestión de Usuarios y Tiendas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-600 dark:text-slate-300 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Tienda</th>
                <th className="px-6 py-3.5">Rol</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800 text-sm font-medium">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 text-gray-900 dark:text-slate-100 font-bold">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{user.store_name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                      user.is_admin ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 
                      user.role === 'seller' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                    }`}>
                      {user.is_admin ? 'Admin' : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                      user.is_blocked ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {user.is_blocked ? 'Bloqueado' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!user.is_admin && (
                      <button
                        onClick={() => toggleBlockUser(user.id, user.is_blocked)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                          user.is_blocked 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-rose-600 text-white hover:bg-rose-700'
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

function MetricCard({ title, value, color }: { title: string; value: number | string; color: string }) {
  return (
    <div className={`${color} text-white p-6 rounded-3xl shadow-xs transition hover:scale-[1.02]`}>
      <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">{title}</p>
      <p className="text-3xl font-black mt-2 tracking-tight">{value}</p>
    </div>
  );
}