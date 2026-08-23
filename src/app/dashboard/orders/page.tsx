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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {view === 'sales' ? 'Historial de Ventas' : 'Mis Compras'}
        </h1>
        <p className="text-gray-600 mt-2">
          {view === 'sales' 
            ? 'Productos que has vendido a otros compradores' 
            : 'Productos que has comprado en el marketplace'}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando órdenes...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">
            {view === 'sales' 
              ? 'Aún no has realizado ninguna venta.' 
              : 'Aún no has realizado ninguna compra.'}
          </p>
          <Link 
            href={view === 'sales' ? '/dashboard/products' : '/marketplace'} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition inline-block"
          >
            {view === 'sales' ? 'Crear tu primer producto' : 'Ir al Marketplace'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'completed' ? 'Completado' :
                     order.status === 'pending' ? 'Pendiente' : order.status}
                  </span>
                  <p className="text-xl font-bold text-indigo-600 mt-2">
                    ${order.total_amount?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Productos:</h3>
                <div className="space-y-2">
                  {order.order_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {item.products?.title || 'Producto eliminado'}
                        </p>
                        <p className="text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="text-gray-900 font-medium">
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