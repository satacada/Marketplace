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
        return { label: '⏳ Pendientes de aprobación', color: 'amber' };
      case 'approved':
        return { label: '✅ Aprobados', color: 'emerald' };
      case 'deleted':
        return { label: '🗑️ Eliminados', color: 'rose' };
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">Administración de Productos</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Gestiona la aprobación, visibilidad y eliminación de productos</p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {(['pending', 'approved', 'deleted'] as TabType[]).map((t) => {
          const config = getTabConfig(t);
          const count = products.length;
          
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
                tab === t 
                  ? `bg-blue-600 text-white shadow-xs` 
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-slate-400 text-center py-8 font-bold">Cargando productos...</p>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xs text-center border border-gray-200/90 dark:border-slate-800">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-gray-600 dark:text-slate-300 text-base font-bold">
            {tab === 'pending' && 'No hay productos pendientes de aprobación.'}
            {tab === 'approved' && 'No hay productos aprobados.'}
            {tab === 'deleted' && 'No hay productos eliminados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between text-gray-900 dark:text-slate-100">
              <div className="relative aspect-square bg-gray-100 dark:bg-slate-800">
                {product.image_urls?.[0] ? (
                  <Image
                    src={product.image_urls[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-500">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-xs ${
                  product.status === 'pending' ? 'bg-amber-500' : 
                  product.status === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {product.status === 'pending' ? '⏳ Pendiente' : 
                   product.status === 'approved' ? '✅ Aprobado' : '❌ Rechazado'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">${product.price?.toLocaleString('es-CL')}</span>
                  <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Stock: {product.stock}</span>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Vendedor:</p>
                  <p className="text-xs font-extrabold text-gray-800 dark:text-slate-200">
                    {product.profiles?.store_name || product.profiles?.email || 'Sin nombre'}
                  </p>
                </div>

                {/* Acciones según pestaña */}
                {tab === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs"
                    >
                      ✓ Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-2xs"
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {tab === 'approved' && (
                  <button
                    onClick={() => handleReject(product.id)}
                    disabled={processingId === product.id}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900 transition"
                  >
                    Eliminar publicación
                  </button>
                )}

                {tab === 'deleted' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleRestore(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-2xs"
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white transition shadow-2xs"
                    >
                      Eliminar Definitivo
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}