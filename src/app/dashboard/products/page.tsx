/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * 
 * @description Página de gestión de productos del vendedor.
 *              Utiliza hooks useAuth y useProducts para gestión.
 * 
 * @module Presentation/Pages/Dashboard/Products
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * - @/features/auth/hooks/useAuth
 * - @/features/products/hooks/useProducts
 * - @/components/ui/Button
 * - @/components/ui/Modal
 * - @/components/marketplace/ImageGallery
 * 
 * @related-files
 * - @/features/products/hooks/useProducts.ts
 * - @/features/products/services/product.service.ts
 * 
 * @exports
 * - ProductsPage (default)
 * 
 * ============================================================================
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProducts } from '@/features/products/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import ImageGallery from '@/components/marketplace/ImageGallery';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[];
  category_id: string;
  is_deleted: boolean;
  categories: { name: string } | null;
  favorite_count?: number;
};

export default function ProductsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // Cargar productos del vendedor sólo cuando user.id esté disponible para evitar parpadeos
  const { 
    products, 
    loading: productsLoading, 
    deleteProduct, 
    toggleStock,
    refresh 
  } = useProducts(user?.id ? { sellerId: user.id, includeFavoriteCount: true } : { sellerId: 'loading-wait' });

  useEffect(() => {
    document.title = 'Mis Productos | Marketplace SaaS';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || !user) return;
    
    setActionId(productToDelete);
    setShowDeleteModal(false);

    const result = await deleteProduct(productToDelete, user.id);
    setActionId(null);
    setProductToDelete(null);

    if (!result.success) {
      alert('Error al eliminar: ' + result.error);
    } else {
      await refresh();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleToggleStock = async (product: Product) => {
    if (!user) return;
    
    setActionId(product.id);
    const result = await toggleStock(product.id, user.id);
    setActionId(null);

    if (!result.success) {
      alert('Error al actualizar stock: ' + result.error);
    }
  };

  if (authLoading || productsLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <p className="text-gray-500 text-center py-8">Cargando productos...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100">Mis Productos</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">Gestiona tu catálogo de productos</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button variant="primary">+ Nuevo Producto</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xs text-center border border-gray-200/90 dark:border-slate-800">
          <p className="text-gray-600 dark:text-slate-300 text-base font-extrabold mb-4">Aún no tienes productos publicados.</p>
          <Link href="/dashboard/products/new">
            <Button variant="primary">Crear tu primer producto</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 flex-shrink-0">
                <ImageGallery images={product.image_urls || []} thumbnailMode={true} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">{product.title}</h3>
                      {product.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          🟡 En revisión
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          🟢 Activo
                        </span>
                      )}
                    </div>
                    {product.categories?.name && (
                      <span className="inline-block mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">{product.categories.name}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">${product.price.toLocaleString()}</p>
                    <p className={`text-xs font-extrabold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock} dispon.` : 'Sin stock (Oculto)'}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                {/* Estadísticas de interés */}
                <div className="flex gap-4 mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🤍</span>
                    <div>
                      <p className="text-xs text-gray-500">Interés</p>
                      <p className="text-lg font-bold text-pink-700">{product.favorite_count || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    <div>
                      <p className="text-xs text-gray-500">Vistas</p>
                      <p className="text-lg font-bold text-purple-700">0</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-gray-200 pt-4">
                  <Link href={`/dashboard/products/edit/${product.id}`}>
                    <Button variant="secondary" size="sm">✏️ Editar</Button>
                  </Link>
                  
                  <Button
                    onClick={() => handleToggleStock(product as any)}
                    disabled={actionId === product.id}
                    variant={product.stock > 0 ? 'secondary' : 'success'}
                    size="sm"
                    isLoading={actionId === product.id}
                  >
                    {product.stock > 0 ? '⏸️ Desactivar' : '▶️ Activar'}
                  </Button>

                  <Button
                    onClick={() => handleDeleteClick(product.id)}
                    disabled={actionId === product.id}
                    variant="danger"
                    size="sm"
                    isLoading={actionId === product.id}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title="¿Eliminar producto?"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Esta acción ocultará el producto del marketplace. El administrador podrá ver el registro de eliminación.
        </p>
        <div className="flex gap-3">
          <Button onClick={handleCancelDelete} variant="secondary" fullWidth>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} variant="danger" fullWidth>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}