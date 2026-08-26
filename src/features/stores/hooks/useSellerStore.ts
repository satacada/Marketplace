/**
 * ============================================================================
 * FILE: useSellerStore.ts
 * ============================================================================
 * 
 * @description Custom Hook para la vitrina dedicada de tienda de un vendedor
 *              (SOLID / SRP).
 * 
 * @module Features/Stores/Hooks/useSellerStore
 * ============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAdvancedProducts } from '@/features/products/hooks/useAdvancedProducts';
import { useSellerReviews } from '@/features/reviews/hooks/useSellerReviews';
import { SortOption } from '@/features/products/types/product-filters.types';

export type SellerProfile = {
  id: string;
  email: string | null;
  store_name: string | null;
  is_trusted_seller: boolean;
  approved_products_count: number;
  city: string | null;
  address: string | null;
};

export function useSellerStore(sellerId: string) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || null;
  const { cart, addToCart } = useCart(userId);
  const { orders } = useOrders('buyer', userId);
  const { categories } = useCategories({ level: 1 });
  const { reviews, summary: ratingSummary, loading: loadingReviews, submitting: submittingReview, addReview } = useSellerReviews(sellerId);

  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
  const [shareProduct, setShareProduct] = useState<{ id: string; title: string; price: number; image_url?: string | null } | null>(null);

  const filters = useMemo(() => ({
    sellerId,
    searchQuery,
    categoryId: selectedCategoryId || undefined,
    sortBy,
    page: 1,
    limit: 50,
  }), [sellerId, searchQuery, selectedCategoryId, sortBy]);

  const { products, loading: loadingProducts, total } = useAdvancedProducts(filters);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setLoadingSeller(true);
        const { data } = await supabase
          .from('profiles')
          .select('id, email, store_name, is_trusted_seller, approved_products_count, city, address')
          .eq('id', sellerId)
          .single();

        if (data) {
          setSellerProfile(data as SellerProfile);
        } else {
          setSellerProfile({
            id: sellerId,
            email: null,
            store_name: 'Tienda en Marketplace',
            is_trusted_seller: false,
            approved_products_count: 0,
            city: 'Barracas',
            address: null,
          });
        }
      } catch (err) {
        console.error('Error cargando perfil del vendedor:', err);
      } finally {
        setLoadingSeller(false);
      }
    };

    if (sellerId) {
      fetchSellerProfile();
    }
  }, [sellerId]);

  const handleToggleFavorite = (productId: string) => {
    setFavoriteProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleAddToCart = (productId: string, productInfo: any) => {
    addToCart({ productId, quantity: 1 }, productInfo);
  };

  return {
    sellerProfile,
    loadingSeller,
    products,
    loadingProducts,
    totalProducts: total,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    sortBy,
    setSortBy,
    favoriteProductIds,
    handleToggleFavorite,
    shareProduct,
    setShareProduct,
    cartItemCount: cart.itemCount,
    cartTotal: cart.total,
    ordersCount: orders.length,
    reviews,
    ratingSummary,
    loadingReviews,
    submittingReview,
    addReview,
    handleAddToCart,
    userId,
    router,
  };
}
