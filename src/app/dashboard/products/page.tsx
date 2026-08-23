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

  // Solo inicializar useProducts cuando el usuario esté disponible
  const shouldLoadProducts = !!user?.id;
  const { 
    products, 
    loading: productsLoading, 
    deleteProduct, 
    toggleStock,
    refresh 
  } = useProducts(shouldLoadProducts ? { sellerId: user?.id } : undefined);

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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
          <p className="text-gray-600 mt-1">Gestiona tu catálogo de productos</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button variant="primary">+ Nuevo Producto</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">Aún no tienes productos publicados.</p>
          <Link href="/dashboard/products/new">
            <Button variant="primary">Crear tu primer producto</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex gap-6">
              <div className="w-48 flex-shrink-0">
                <ImageGallery images={product.image_urls || []} thumbnailMode={true} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                    {product.categories?.name && (
                      <span className="inline-block mt-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{product.categories.name}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                    <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock (Oculto)'}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

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