/**
 * ============================================================================
 * FILE: page.tsx (dashboard/admin/products)
 * ============================================================================
 * 
 * @description Panel de Administración de Productos con diseño horizontal
 *              de ancho completo (Full Width Rows) para eliminar espacios vacíos
 *              a la derecha y permitir aprobación rápida (Imagen cargada por usuario).
 * 
 * @module Presentation/Pages/Dashboard/Admin/Products
 * ============================================================================
 */

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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Administración de Productos</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Gestiona la aprobación, visibilidad y eliminación de productos de la plataforma.</p>
      </div>

      {/* Pestañas de Filtro */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {(['pending', 'approved', 'deleted'] as TabType[]).map((t) => {
          const config = getTabConfig(t);
          const count = products.length;
          
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
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
        /* Tarjetas en Filas Horizontales de Ancho Completo (Full Width) para eliminar espacios vacíos */
        <div className="space-y-4 w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full hover:border-blue-200 dark:hover:border-slate-700 transition"
            >
              {/* Foto + Badge de Estado */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200/60 dark:border-slate-800">
                  {product.image_urls?.[0] ? (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-500">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-xs ${
                    product.status === 'pending' ? 'bg-amber-500' : 
                    product.status === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}>
                    {product.status === 'pending' ? '⏳ Pendiente' : 
                     product.status === 'approved' ? '✅ Aprobado' : '❌ Rechazado'}
                  </div>
                </div>

                {/* Detalles de Titulo, Descripcion y Vendedor */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-black text-base text-gray-900 dark:text-slate-100 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                    {product.description || 'Sin descripción adicional.'}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-1 text-xs">
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                      ${product.price?.toLocaleString('es-CL')}
                    </span>
                    <span className="font-extrabold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-[11px]">
                      Stock: {product.stock} u.
                    </span>
                  </div>

                  <div className="pt-1 text-[11px] text-gray-400 dark:text-slate-500 font-bold flex items-center gap-1">
                    <span>Vendedor:</span>
                    <span className="text-gray-800 dark:text-slate-200 font-extrabold">
                      {product.profiles?.store_name || product.profiles?.email || 'Sin nombre'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción a la Derecha (Aprobar, Rechazar, Restaurar, Eliminar) */}
              <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-44 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
                {tab === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>✓</span>
                      <span>Aprobar</span>
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>Rechazar</span>
                    </button>
                  </>
                )}

                {tab === 'approved' && (
                  <button
                    onClick={() => handleReject(product.id)}
                    disabled={processingId === product.id}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
                  >
                    Eliminar publicación
                  </button>
                )}

                {tab === 'deleted' && (
                  <>
                    <button
                      onClick={() => handleRestore(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(product.id)}
                      disabled={processingId === product.id}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-rose-700 hover:bg-rose-800 text-white transition shadow-xs cursor-pointer"
                    >
                      Eliminar Definitivo
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}