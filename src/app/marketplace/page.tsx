/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * 
 * @description Página del marketplace público mejorada.
 *              Diseño tipo Amazon/Mercado Libre con filtros avanzados,
 *              búsqueda con autocompletado, paginación infinita y optimizaciones.
 * 
 * @module Presentation/Pages/Marketplace
 * 
 * @author System
 * @created 2026-07-17
 * 
 * @dependencies
 * - react
 * - @/features/products/hooks/useAdvancedProducts
 * - @/features/cart/hooks/useCart
 * - @/features/categories/hooks/useCategories
 * - @/features/auth/hooks/useAuth
 * - @/shared/utils/debounce
 * - @/shared/utils/localStorage
 * - @/components/layout/Header
 * - @/components/marketplace/ImageGallery
 * 
 * @related-files
 * - @/features/products/hooks/useAdvancedProducts.ts
 * - @/features/cart/hooks/useCart.ts
 * 
 * @exports
 * - MarketplacePage (default)
 * 
 * ============================================================================
 */

'use client';

import { useState, useCallback, memo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdvancedProducts } from '@/features/products/hooks/useAdvancedProducts';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import ImageGallery from '@/components/marketplace/ImageGallery';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { debounce } from '@/shared/utils/debounce';
import { getLocalStorageItem, setLocalStorageItem } from '@/shared/utils/localStorage';
import { AdvancedProductFilters, SortOption } from '@/features/products/types/product-filters.types';

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_urls: string[] | null;
  seller_id: string;
  category_id: string | null;
  status: string;
  categories: { name: string } | null;
  profiles: { store_name: string | null } | null;
  has_free_shipping?: boolean;
  average_rating?: number;
};

const ProductCard = memo(({ 
  product, 
  userId, 
  cartItems, 
  onAddToCart,
  onViewDetails,
  isFavorite,
  onToggleFavorite
}: { 
  product: Product; 
  userId: string | null; 
  cartItems: string[]; 
  onAddToCart: (id: string) => void;
  onViewDetails: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}) => {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.image_urls || [];
  const isInCart = cartItems.includes(product.id);
  const isOwnProduct = userId && product.seller_id === userId;

  const openLightbox = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

  const handleClick = useCallback(() => {
    onViewDetails(product.id);
  }, [product.id, onViewDetails]);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={handleClick}
      >
        {/* Galería de imágenes con navegación */}
        <div className="relative aspect-square bg-gray-100">
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-full">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onClick={openLightbox}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              <button
                onClick={(e) => openLightbox(e)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                📷 Ver fotos
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-6xl">📦</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.has_free_shipping && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                🚚 Envío gratis
              </span>
            )}
            {product.average_rating && product.average_rating >= 4 && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
                ⭐ {product.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {product.categories?.name || 'Sin categoría'}
              </span>
              
              {userId && !isOwnProduct && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition text-sm p-1"
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              )}

              {isOwnProduct && product.status === 'pending' && (
                <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded border border-yellow-300">
                  Pendiente
                </span>
              )}
              
              {isOwnProduct && product.status === 'rejected' && (
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded border border-red-300">
                  ❌ Rechazado
                </span>
              )}
            </div>
            
            <h3 className="text-base font-bold text-gray-900 mb-1 hover:text-blue-600 transition line-clamp-2">
              {product.title}
            </h3>
            
            <p className="text-gray-500 mb-3 line-clamp-2 text-xs">
              {product.description}
            </p>
            
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-2xl font-bold text-blue-600">
                ${product.price?.toLocaleString('es-CL')}
              </span>
              <span className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
              </span>
            </div>
          </div>
          
          {/* Botón de acción Agregar (Estilo Importadora Mitre) */}
          <div className="pt-2">
            {isOwnProduct ? (
              <button disabled className="w-full py-2.5 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed text-xs">
                Es tu producto
              </button>
            ) : isInCart ? (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-lg font-semibold bg-blue-50 text-blue-700 border border-blue-200 cursor-default text-sm flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>En carrito</span>
              </button>
            ) : product.stock === 0 ? (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                <span>Sin stock</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product.id);
                }}
                className="w-full py-2.5 px-4 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
              >
                <span className="text-base">🛒</span>
                <span>Agregar</span>
              </button>
            )}

            <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
              <span>Vendido por:</span>
              <span className="font-medium text-gray-600 truncate max-w-[130px]">
                {product.profiles?.store_name || 'Tienda sin nombre'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={closeLightbox}
          >
            ×
          </button>
          
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white text-4xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 text-white text-4xl hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev + 1) % images.length);
                }}
              >
                ›
              </button>
            </>
          )}
          
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentImageIndex]}
              alt={`${product.title} - Imagen ${currentImageIndex + 1}`}
              width={800}
              height={600}
              className="object-contain rounded-lg"
            />
            {images.length > 1 && (
              <p className="text-white text-center mt-2">
                {currentImageIndex + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, addToCart } = useCart(user?.id || null);
  const { orders } = useOrders('buyer', user?.id || null);
  const { categories } = useCategories({ level: 1 });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [hasFreeShipping, setHasFreeShipping] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Productos vistos recientemente
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Estado para Modal estándar UI
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'error' | 'warning';
    actionUrl?: string;
    actionText?: string;
  }>({
    title: '',
    message: '',
    type: 'info',
  });

  const showModalMessage = useCallback((
    title: string,
    message: string,
    type: 'success' | 'info' | 'error' | 'warning' = 'info',
    actionUrl?: string,
    actionText?: string
  ) => {
    setModalData({ title, message, type, actionUrl, actionText });
    setShowModal(true);
  }, []);

  const userId = user?.id || null;
  const cartProductIds = cart.items.map(item => item.product_id);

  // Cargar productos vistos recientemente
  useEffect(() => {
    const viewed = getLocalStorageItem<string[]>('recentlyViewed', []);
    setRecentlyViewed(viewed);
  }, []);

  // Cargar favoritos del usuario en una sola consulta
  useEffect(() => {
    const loadUserFavorites = async () => {
      if (!userId) {
        setFavoriteProductIds(new Set());
        return;
      }

      try {
        const { supabase } = await import('@/infrastructure/database/supabase.client');
        const { data } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', userId);
        
        const favoriteIds = new Set(data?.map(f => f.product_id) || []);
        setFavoriteProductIds(favoriteIds);
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    };

    loadUserFavorites();
  }, [userId]);

  // Debounce para búsqueda
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Configurar filtros avanzados
  const filters: AdvancedProductFilters = {
    searchQuery,
    categoryId: selectedCategoryId || undefined,
    priceRange: priceRange.max > 0 ? priceRange : undefined,
    sortBy,
    hasFreeShipping,
    page: 1,
    limit: 20,
  };

  const { 
    products, 
    loading, 
    total,
    hasMore,
    loadMore,
    refresh,
    setSearchQuery: setHookSearchQuery,
    setCategoryId: setHookCategoryId,
    setPriceRange: setHookPriceRange,
    setSortBy: setHookSortBy,
    updateFilters 
  } = useAdvancedProducts(filters);

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current && loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  const handleAddToCart = async (productId: string) => {
    if (!userId) {
      showModalMessage(
        'Iniciar Sesión Requerido',
        'Debes iniciar sesión para agregar productos a tu carrito de compras.',
        'info',
        '/auth',
        'Iniciar Sesión'
      );
      return;
    }

    const result = await addToCart({ productId, quantity: 1 });
    if (!result.success) {
      showModalMessage('Error', result.error || 'No se pudo agregar el producto al carrito', 'error');
    }
  };

  const handleViewDetails = useCallback((productId: string) => {
    // Guardar en productos vistos recientemente
    const newViewed = [productId, ...recentlyViewed.filter(id => id !== productId)].slice(0, 10);
    setRecentlyViewed(newViewed);
    setLocalStorageItem('recentlyViewed', newViewed);
    
    // Navegar a detalle
    window.location.href = `/marketplace/product/${productId}`;
  }, [recentlyViewed]);

  const handleToggleFavorite = useCallback(async (productId: string) => {
    if (!userId) {
      showModalMessage(
        'Iniciar Sesión Requerido',
        'Debes iniciar sesión para guardar productos en tus favoritos.',
        'info',
        '/auth',
        'Iniciar Sesión'
      );
      return;
    }

    try {
      const { supabase } = await import('@/infrastructure/database/supabase.client');
      
      if (favoriteProductIds.has(productId)) {
        // Quitar de favoritos
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
        setFavoriteProductIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Agregar a favoritos
        await supabase
          .from('favorites')
          .insert({ user_id: userId, product_id: productId });
        setFavoriteProductIds(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error('Error al manejar favoritos:', error);
    }
  }, [userId, favoriteProductIds, showModalMessage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    if (input) {
      const query = input.value;
      setSearchInputValue(query);
      setHookSearchQuery(query);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value as SortOption;
    setSortBy(sortBy);
    setHookSortBy(sortBy);
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const newPriceRange = {
      ...priceRange,
      [field]: parseFloat(value) || 0
    };
    setPriceRange(newPriceRange);
    setHookPriceRange(newPriceRange);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setHookCategoryId(categoryId);
  };

  const clearFilters = () => {
    setSearchInputValue('');
    setSearchQuery('');
    setSelectedCategoryId('');
    setPriceRange({ min: 0, max: 0 });
    setSortBy('relevance');
    setHasFreeShipping(false);
    updateFilters({
      searchQuery: '',
      categoryId: undefined,
      priceRange: undefined,
      sortBy: 'relevance',
      hasFreeShipping: false,
      page: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title=""
        cartItemCount={cart.itemCount}
        cartTotal={cart.total}
        ordersCount={user ? orders.length : undefined}
        isMarketplacePublic={true}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header de búsqueda */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar productos por nombre o descripción..."
                value={searchInputValue}
                onChange={handleSearchChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition"
                aria-label="Buscar"
              >
                🔍
              </button>
            </div>
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="relevance">Relevancia</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="rating_desc">Mejor valorados</option>
                <option value="newest">Más recientes</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpiar
                </button>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Categorías</h4>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rango de precio */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Precio</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Envío gratis */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFreeShipping}
                    onChange={(e) => setHasFreeShipping(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Solo envío gratis</span>
                </label>
              </div>

              {/* Resultados */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {total} productos encontrados
                </p>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <main className="flex-1">
            {loading && products.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Cargando productos...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md border border-gray-100 text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product as any} 
                      userId={userId}
                      cartItems={cartProductIds}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                      isFavorite={favoriteProductIds.has(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Loader para infinite scroll */}
                {hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {loading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : (
                      <p className="text-gray-500">Cargar más productos...</p>
                    )}
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Has llegado al final de los resultados</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modal Profesional Estándar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="sm"
      >
        <div className={`text-center p-6 rounded-t-lg ${
          modalData.type === 'success' 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50' 
            : modalData.type === 'error'
            ? 'bg-gradient-to-br from-red-50 to-pink-50'
            : modalData.type === 'warning'
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50'
        }`}>
          <div className="text-6xl mb-3">
            {modalData.type === 'success' ? '✅' : modalData.type === 'error' ? '❌' : modalData.type === 'warning' ? '⚠️' : '🔒'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {modalData.title}
          </h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center whitespace-pre-line leading-relaxed mb-6">
            {modalData.message}
          </p>
          
          <div className="flex gap-3">
            {modalData.actionUrl ? (
              <>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="secondary"
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    router.push(modalData.actionUrl!);
                  }}
                  variant="primary"
                  fullWidth
                >
                  {modalData.actionText || 'Iniciar Sesión'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowModal(false)}
                fullWidth
                variant={modalData.type === 'success' ? 'success' : modalData.type === 'error' ? 'danger' : 'primary'}
              >
                Entendido
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}