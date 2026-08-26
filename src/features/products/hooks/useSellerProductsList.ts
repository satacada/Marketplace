/**
 * ============================================================================
 * FILE: useSellerProductsList.ts
 * ============================================================================
 * 
 * @description Custom Hook para la lista de productos del vendedor en el dashboard
 *              con gestión de borrado, stock y recuperación a prueba de fallos (SOLID / SRP).
 * 
 * @module Features/Products/Hooks/useSellerProductsList
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProducts } from '@/features/products/hooks/useProducts';

export function useSellerProductsList() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const [directProducts, setDirectProducts] = useState<any[]>([]);
  const [directLoading, setDirectLoading] = useState(true);

  const { 
    products, 
    loading: productsLoading, 
    deleteProduct, 
    toggleStock,
    refresh 
  } = useProducts(user?.id ? { sellerId: user.id, includeFavoriteCount: true } : { sellerId: 'loading-wait' });

  useEffect(() => {
    async function loadDirectSellerProducts() {
      if (!user?.id) return;
      setDirectLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('seller_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setDirectProducts(data);
        }
      } catch (err) {
        console.error('Error cargando lista directa de productos:', err);
      } finally {
        setDirectLoading(false);
      }
    }

    if (user?.id) {
      loadDirectSellerProducts();
    }
  }, [user?.id]);

  const displayProducts = directProducts.length > 0 ? directProducts : products;

  const handleDeleteConfirm = async () => {
    if (!productToDelete || !user?.id) return;
    setActionId(productToDelete);
    await deleteProduct(productToDelete, user.id);
    setShowDeleteModal(false);
    setProductToDelete(null);
    setActionId(null);
    setDirectProducts(prev => prev.filter(p => p.id !== productToDelete));
    refresh();
  };

  const handleToggleStock = async (id: string, currentStock: number) => {
    if (!user?.id) return;
    setActionId(id);
    await toggleStock(id, user.id);
    setActionId(null);
    setDirectProducts(prev => prev.map(p => p.id === id ? { ...p, stock: currentStock > 0 ? 0 : 10 } : p));
    refresh();
  };

  return {
    user,
    authLoading,
    productsLoading: productsLoading && directLoading,
    displayProducts,
    showDeleteModal,
    setShowDeleteModal,
    productToDelete,
    setProductToDelete,
    actionId,
    handleDeleteConfirm,
    handleToggleStock,
    router,
  };
}
