/**
 * ============================================================================
 * FILE: useMarketplaceCatalog.ts
 * ============================================================================
 * 
 * @description Custom Hook para la gestión de estado, filtros, recomendaciones por telemetría,
 *              búsqueda visual y carrito en el catálogo del Marketplace (SOLID / SRP).
 * 
 * @module Features/Marketplace/Hooks/useMarketplaceCatalog
 * ============================================================================
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAdvancedProducts } from '@/features/products/hooks/useAdvancedProducts';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AdvancedProductFilters, SortOption } from '@/features/products/types/product-filters.types';
import { trackUserEvent } from '@/lib/telemetry';

export function useMarketplaceCatalog() {
  const router = useRouter();

  // Estados de autenticación y carrito
  const { user } = useAuth();
  const userId = user?.id || null;
  const { cart, addToCart } = useCart();

  // Estado de lista de Favoritos del usuario
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Estados de filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Estado de Ubicación y Radio GPS (Buenos Aires / Barracas · En un radio de 6 km)
  const [locationName, setLocationName] = useState('Buenos Aires');
  const [radiusKm, setRadiusKm] = useState(6);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Estado del recomendador por telemetría (A demanda)
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Estado de Búsqueda Visual por Foto
  const [showVisualSearchModal, setShowVisualSearchModal] = useState(false);
  const [visualSearchImage, setVisualSearchImage] = useState<string | null>(null);
  const [isProcessingVisualSearch, setIsProcessingVisualSearch] = useState(false);

  const handleVisualSearchSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVisualSearchImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmVisualSearch = () => {
    setIsProcessingVisualSearch(true);
    setTimeout(() => {
      setIsProcessingVisualSearch(false);
      setShowVisualSearchModal(false);
    }, 1000);
  };

  // Estado de Compartir Producto en Redes
  const [shareProduct, setShareProduct] = useState<any | null>(null);

  // Categorías
  const { categories, loading: categoriesLoading } = useCategories();

  // Construir filtros memorizados para el hook avanzado
  const filters: AdvancedProductFilters = useMemo(() => ({
    searchQuery: searchQuery.trim() || undefined,
    categoryId: selectedCategory || undefined,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    inStockOnly,
    sortBy,
    page: currentPage,
    limit: itemsPerPage,
  }), [searchQuery, selectedCategory, priceRange, inStockOnly, sortBy, currentPage]);

  const { products, loading: productsLoading, total, refresh } = useAdvancedProducts(filters);
  const totalPages = Math.ceil(total / itemsPerPage);

  // Cargar lista inicial de Favoritos
  useEffect(() => {
    if (userId) {
      loadFavorites();
    } else {
      setFavoriteProductIds([]);
    }
  }, [userId]);

  const loadFavorites = async () => {
    if (!userId) return;
    setFavoritesLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);

      if (!error && data) {
        setFavoriteProductIds(data.map(f => f.product_id));
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (!userId) {
      router.push('/auth');
      return;
    }

    const isFav = favoriteProductIds.includes(productId);

    if (isFav) {
      setFavoriteProductIds(prev => prev.filter(id => id !== productId));
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
    } else {
      setFavoriteProductIds(prev => [...prev, productId]);
      await supabase
        .from('favorites')
        .insert({ user_id: userId, product_id: productId });
      
      trackUserEvent({ eventType: 'favorite', productId });
    }
  };

  const handleAddToCart = (id: string, productInfo?: { title: string; price?: number; image_url: string | null; seller_id: string }) => {
    addToCart({ productId: id, quantity: 1 }, productInfo);
    if (userId) {
      trackUserEvent({ eventType: 'cart_add', productId: id });
    }
  };

  const handleViewDetails = (id: string) => {
    if (userId) {
      trackUserEvent({ eventType: 'view', productId: id });
    }
    router.push(`/marketplace/product/${id}`);
  };

  // Mapear cantidades en el carrito
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    if (cart && Array.isArray(cart.items)) {
      cart.items.forEach(item => {
        map[item.product_id] = item.quantity;
      });
    }
    return map;
  }, [cart]);

  return {
    userId,
    products,
    productsLoading,
    totalCount: total,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    showRecommendations,
    setShowRecommendations,
    showVisualSearchModal,
    setShowVisualSearchModal,
    visualSearchImage,
    setVisualSearchImage,
    isProcessingVisualSearch,
    handleVisualSearchSelect,
    handleConfirmVisualSearch,
    setIsProcessingVisualSearch,
    shareProduct,
    setShareProduct,
    categories,
    categoriesLoading,
    favoriteProductIds,
    handleToggleFavorite,
    handleAddToCart,
    handleViewDetails,
    locationName,
    setLocationName,
    radiusKm,
    setRadiusKm,
    showLocationModal,
    setShowLocationModal,
    cartQuantities,
    refresh,
    router,
  };
}
