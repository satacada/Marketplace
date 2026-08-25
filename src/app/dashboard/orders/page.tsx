'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('buyer');
  const searchParams = useSearchParams();
  const view = searchParams.get('view'); // 'sales' o 'purchases'
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, [view]);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);

    // Obtener rol del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    setUserRole(profile?.role || 'buyer');

    let query;
    
    // Determinar qué vista mostrar según el parámetro view
    if (view === 'sales' && profile?.role === 'seller') {
      // Vendedor viendo sus ventas
      query = supabase
        .from('orders')
        .select(`
          id,
          buyer_id,
          total_amount,
          status,
          created_at,
          order_items (
            product_id,
            quantity,
            price_at_purchase,
            products (title)
          )
        `)
        .eq('order_items.seller_id', user.id);
    } else {
      // Comprador viendo sus compras (vista por defecto)
      query = supabase
        .from('orders')
        .select(`
          id,
          buyer_id,
          total_amount,
          status,
          created_at,
          order_items (
            product_id,
            quantity,
            price_at_purchase,
            products (title)
          )
        `)
        .eq('buyer_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando órdenes:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <span>{view === 'sales' ? '📋 Historial de Ventas' : '🛒 Mis Compras'}</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">
          {view === 'sales' 
            ? 'Gestión de productos que has vendido a otros compradores en Marketplace' 
            : 'Historial de productos que has comprado en el marketplace'}
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400 font-medium">Cargando historial...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xs text-center border border-gray-200/90 dark:border-slate-800">
          <div className="text-5xl mb-3">🛍️</div>
          <p className="text-gray-600 dark:text-slate-300 text-sm font-bold mb-4">
            {view === 'sales' 
              ? 'Aún no has realizado ninguna venta.' 
              : 'Aún no has realizado ninguna compra.'}
          </p>
          <Link 
            href={view === 'sales' ? '/dashboard/products/new' : '/marketplace'} 
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition inline-block shadow-xs"
          >
            {view === 'sales' ? '🚀 Publicar mi primer producto' : '🛒 Explorar Marketplace'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 hover:shadow-xs transition">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-900 dark:text-slate-100">Pedido #{order.id.slice(0, 8)}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      order.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' :
                      order.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}>
                      {order.status === 'completed' ? '✓ Completado' :
                       order.status === 'pending' ? '⏳ Pendiente' : order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-slate-400 font-medium mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ${order.total_amount?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-2">Productos comprados:</h3>
                <div className="space-y-2">
                  {order.order_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📦</span>
                        <div>
                          <p className="text-gray-900 dark:text-slate-100 font-extrabold text-xs">
                            {item.products?.title || 'Producto del catálogo'}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">Cantidad: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-gray-900 dark:text-slate-100 font-black text-sm">
                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}