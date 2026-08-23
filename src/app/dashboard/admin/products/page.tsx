'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  status: string;
  is_deleted: boolean;
  image_urls: string[] | null;
  seller_id: string;
  created_at: string;
  deleted_at?: string | null;
  profiles: { email: string; store_name: string | null } | null;
};

type TabType = 'pending' | 'approved' | 'deleted';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<TabType>('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, [tab]);

  const loadProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('products')
      .select('*, profiles(email, store_name)')
      .order('created_at', { ascending: false });

    if (tab === 'pending') {
      query = query.eq('status', 'pending').eq('is_deleted', false);
    } else if (tab === 'approved') {
      query = query.eq('status', 'approved').eq('is_deleted', false);
    } else if (tab === 'deleted') {
      query = query.eq('is_deleted', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error cargando productos:', error);
    } else {
      const mapped = data?.map(p => ({
        ...p,
        profiles: p.profiles?.[0] || null
      })) || [];
      
      setProducts(mapped);
    }
    setLoading(false);
  };

  const handleApprove = async (productId: string) => {
    setProcessingId(productId);
    
    const { error } = await supabase
      .from('products')
      .update({ status: 'approved', is_deleted: false })
      .eq('id', productId);

    if (error) {
      alert('Error al aprobar: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== productId));
    }
    
    setProcessingId(null);
  };

  const handleReject = async (productId: string) => {
    if (!confirm('¿Rechazar este producto? Será marcado como eliminado.')) return;
    
    setProcessingId(productId);
    
    const { error } = await supabase
      .from('products')
      .update({ status: 'rejected', is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) {
      alert('Error al rechazar: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== productId));
    }
    
    setProcessingId(null);
  };

  const handleRestore = async (productId: string) => {
    setProcessingId(productId);
    
    const { error } = await supabase
      .from('products')
      .update({ is_deleted: false, deleted_at: null, status: 'pending' })
      .eq('id', productId);

    if (error) {
      alert('Error al restaurar: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== productId));
    }
    
    setProcessingId(null);
  };

  const handlePermanentDelete = async (productId: string) => {
    if (!confirm('¿Eliminar PERMANENTEMENTE? Esta acción no se puede deshacer.')) return;
    
    setProcessingId(productId);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== productId));
    }
    
    setProcessingId(null);
  };

  const getTabConfig = (t: TabType) => {
    switch (t) {
      case 'pending':
        return { label: '⏳ Pendientes de aprobación', color: 'yellow' };
      case 'approved':
        return { label: '✅ Aprobados', color: 'green' };
      case 'deleted':
        return { label: '🗑️ Eliminados', color: 'red' };
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Administración de Productos</h1>
        <p className="text-gray-600 mt-1">Gestiona la aprobación, visibilidad y eliminación de productos</p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
        {(['pending', 'approved', 'deleted'] as TabType[]).map((t) => {
          const config = getTabConfig(t);
          const count = products.filter(p => {
            if (t === 'deleted') return p.is_deleted;
            return p.status === t && !p.is_deleted;
          }).length;
          
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t 
                  ? `bg-${config.color}-600 text-white` 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Cargando productos...</p>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-gray-500 text-lg">
            {tab === 'pending' && 'No hay productos pendientes de aprobación.'}
            {tab === 'approved' && 'No hay productos aprobados.'}
            {tab === 'deleted' && 'No hay productos eliminados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {product.image_urls?.[0] ? (
                  <Image
                    src={product.image_urls[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${
                  product.status === 'pending' ? 'bg-yellow-500' : 
                  product.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {product.status === 'pending' ? '⏳ Pendiente' : 
                   product.status === 'approved' ? '✅ Aprobado' : '❌ Rechazado'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-indigo-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mb-3">
                  <p className="text-xs text-gray-500">Vendedor:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {product.profiles?.store_name || product.profiles?.email || 'Sin nombre'}
                  </p>
                </div>

                {/* Acciones según pestaña */}
                {tab === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(product.id)}
                      disabled={processingId === product.id}
                      className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                        processingId === product.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      disabled={processingId === product.id}
                      className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                        processingId === product.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                       Rechazar
                    </button>
                  </div>
                )}

                {tab === 'deleted' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(product.id)}
                      disabled={processingId === product.id}
                      className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                        processingId === product.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      ♻️ Restaurar
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(product.id)}
                      disabled={processingId === product.id}
                      className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                        processingId === product.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}

                {tab === 'approved' && (
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar este producto aprobado?')) {
                        handleReject(product.id);
                      }
                    }}
                    disabled={processingId === product.id}
                    className={`w-full py-2 rounded-lg font-medium text-white transition ${
                      processingId === product.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    🗑️ Marcar como eliminado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}