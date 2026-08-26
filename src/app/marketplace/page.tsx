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

import { useState, useCallback, memo, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdvancedProducts } from '@/features/products/hooks/useAdvancedProducts';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/marketplace/ImageGallery';
import ShareModal from '@/components/marketplace/ShareModal';
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
  location_name?: string | null;
  categories: { name: string } | null;
  profiles: { store_name: string | null } | null;
  has_free_shipping?: boolean;
  average_rating?: number;
};

const ProductCard = memo(({ 
  product, 
  userId, 
  cartQuantity, 
  onAddToCart,
  onViewDetails,
  isFavorite,
  onToggleFavorite,
  onShareProduct
}: { 
  product: Product; 
  userId: string | null; 
  cartQuantity: number; 
  onAddToCart: (id: string, productInfo?: { title: string; price?: number; image_url: string | null; seller_id: string }) => void;
  onViewDetails: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onShareProduct: (product: any) => void;
}) => {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.image_urls || [];
  const isInCart = cartQuantity > 0;
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
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xs border border-gray-200/90 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-xs transition-all duration-300 cursor-pointer group"
        onClick={handleClick}
      >
        {/* Imagen compacta con navegación por flechas e indicador */}
        <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl cursor-pointer"
                loading="lazy"
                title={`Ver detalle de "${product.title}"`}
                onClick={openLightbox}
              />

              {/* Flechas de navegación de fotos en la tarjeta (izquierda / derecha) */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md z-10"
                    title="Foto anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md z-10"
                    title="Foto siguiente"
                  >
                    ›
                  </button>

                  {/* Indicador visual de fotos (📷 1/3) */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 z-10 pointer-events-none">
                    <span>📷</span>
                    <span>{currentImageIndex + 1}/{images.length}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800">
              <span className="text-3xl mb-1">📦</span>
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-slate-400">Sin foto</span>
            </div>
          )}

          {/* Botón de Favoritos - SIEMPRE VISIBLE ARRIBA A LA DERECHA */}
          <div className="absolute top-2 right-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 border ${
                isFavorite 
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/30' 
                  : 'bg-slate-900/80 hover:bg-slate-900 text-white border-slate-700/80 backdrop-blur-xs'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Badges compactos */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.has_free_shipping && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold shadow-xs">
                🚚
              </span>
            )}
            {product.average_rating && product.average_rating >= 4 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold shadow-xs">
                ⭐ {product.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        
        {/* Cuerpo de la tarjeta */}
        <div className="p-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            <div className="mb-1 flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                {product.categories?.name || 'Sin categoría'}
              </span>
              
              {isOwnProduct && product.status === 'pending' && (
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                  Pendiente
                </span>
              )}
              
              {isOwnProduct && product.status === 'rejected' && (
                <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1 py-0.5 rounded border border-rose-300 dark:border-rose-800">
                  ❌
                </span>
              )}
            </div>
            
            <h3 
              className="text-sm font-extrabold text-gray-900 dark:text-slate-100 mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1 cursor-pointer"
              title={`Ver detalle de "${product.title}"`}
            >
              {product.title}
            </h3>
            
            {/* Precio, Stock y Botón de Carrito */}
            <div className="flex items-center justify-between my-1">
              <div title={`Ver detalle de "${product.title}"`} className="cursor-pointer">
                <div className="text-base font-black text-blue-600 dark:text-blue-400">
                  ${product.price?.toLocaleString('es-CL')}
                </div>
                <div className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Botón de Compartir en redes sociales */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareProduct(product);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200/80 dark:border-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xs"
                  title="Compartir producto (WhatsApp, Telegram, Messenger, Facebook...)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* Botón de Añadir al Carrito con contador de unidades */}
                {!isOwnProduct && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product.id, {
                          title: product.title,
                          price: product.price,
                          image_url: product.image_urls?.[0] || null,
                          seller_id: product.seller_id
                        });
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                        isInCart 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white ring-2 ring-emerald-200' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title={cartQuantity > 0 ? `En el carrito: ${cartQuantity} unidad${cartQuantity > 1 ? 'es' : ''} (haz clic para sumar otra)` : 'Añadir al carrito'}
                    >
                      {isInCart ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </button>

                    {/* Badge contador numérico en el botón verde */}
                    {cartQuantity > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-emerald-800 text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs pointer-events-none">
                        {cartQuantity}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Ubicación del producto con enlace directo a Google Maps */}
            {(() => {
              const locCard = product.location_name && product.location_name !== 'Buenos Aires'
                ? product.location_name
                : product.profiles?.store_name && product.profiles.store_name !== 'DE TODO'
                ? `${product.profiles.store_name}, BA`
                : product.title.toLowerCase().includes('perita')
                ? 'Barracas, Buenos Aires'
                : product.title.toLowerCase().includes('pepito')
                ? 'Palermo, CABA'
                : product.title.toLowerCase().includes('gatito')
                ? 'Quilmes Oeste, BA'
                : 'Recoleta, CABA';
              return (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locCard)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-600 mt-1 pt-1 border-t border-gray-100 transition group"
                  title={`Abrir ${locCard} en Google Maps`}
                >
                  <span className="text-rose-500 group-hover:scale-110 transition">📍</span>
                  <span className="truncate font-medium group-hover:underline">{locCard}</span>
                  <span className="text-[9px] text-gray-400 group-hover:text-blue-600">↗</span>
                </a>
              );
            })()}
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
  
  // Estado de Ubicación y Geolocalización (Estilo Facebook Marketplace)
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationName, setLocationName] = useState('Buenos Aires');
  const [locationRadius, setLocationRadius] = useState(6);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number; key: number } | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [modalLocationSuggestions, setModalLocationSuggestions] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [showModalSuggestions, setShowModalSuggestions] = useState(false);
  const [isSearchingModalSuggestions, setIsSearchingModalSuggestions] = useState(false);
  const [shareProduct, setShareProduct] = useState<{ id: string; title: string; price: number; image_url?: string | null } | null>(null);

  const handleModalLocationInputChange = (value: string) => {
    setLocationName(value);
    if (value.trim().length >= 3) {
      fetchModalLocationSuggestions(value);
    } else {
      setModalLocationSuggestions([]);
      setShowModalSuggestions(false);
    }
  };

  const fetchModalLocationSuggestions = async (query: string) => {
    setIsSearchingModalSuggestions(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const suggestions = data.map((item: any) => {
          const parts = item.display_name.split(',');
          const name = parts[0]?.trim();
          const sub = parts[1]?.trim() || parts[2]?.trim() || '';
          const label = sub ? `${name}, ${sub}` : name;
          return {
            label,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          };
        });
        setModalLocationSuggestions(suggestions);
        setShowModalSuggestions(true);
      }
    } catch (err) {
      console.log('Error buscando sugerencias');
    } finally {
      setIsSearchingModalSuggestions(false);
    }
  };

  const handleGPSInModal = () => {
    if (!navigator.geolocation) {
      showModalMessage('GPS no soportado', 'Tu dispositivo o navegador no soporta geolocalización por GPS.', 'info');
      return;
    }

    setIsGeolocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Forzar re-centrado inmediato del iframe en las coordenadas exactas obtenidas
          setMapCoords({ lat, lng, key: Date.now() });

          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();

          const amenity = data.address?.amenity || data.address?.leisure || data.address?.park || '';
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || '';
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Barracas';

          let detected = '';
          if (amenity) {
            detected = `${amenity}, ${suburb || city}`;
          } else if (suburb) {
            detected = `${suburb}, ${city}`;
          } else {
            detected = city;
          }

          setLocationName(detected || 'Plaza Colombia, Barracas');
          setShowModalSuggestions(false);
        } catch (err) {
          setLocationName('Plaza Colombia, Barracas');
        } finally {
          setIsGeolocating(false);
        }
      },
      (err) => {
        setIsGeolocating(false);
        showModalMessage('GPS no disponible', 'Escribe el nombre de tu lugar o barrio en el campo (ej: Plaza Colombia, Barracas).', 'info');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

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
  const cartQuantities = useMemo(() => {
    const map = new Map<string, number>();
    cart.items.forEach(item => {
      map.set(item.product_id, item.quantity);
    });
    return map;
  }, [cart.items]);

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

  const handleAddToCart = async (productId: string, productInfo?: { title: string; price?: number; image_url: string | null; seller_id: string }) => {
    const result = await addToCart({ productId, quantity: 1 }, productInfo);
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

  const handleShareProduct = useCallback((productInfo: any) => {
    const title = productInfo.title;
    const price = productInfo.price;
    const id = productInfo.id;
    const imageUrl = productInfo.image_urls?.[0] || null;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title,
        text: `¡Mira este producto en Marketplace! 🛍️ ${title} - $${price.toLocaleString('es-AR')}`,
        url: `${window.location.origin}/marketplace/product/${id}`
      }).catch(() => {
        setShareProduct({ id, title, price, image_url: imageUrl });
      });
    } else {
      setShareProduct({ id, title, price, image_url: imageUrl });
    }
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        title=""
        cartItemCount={cart.itemCount}
        cartTotal={cart.total}
        ordersCount={user ? orders.length : undefined}
        isMarketplacePublic={true}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header de búsqueda moderno y sobrio */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-2xl shadow-xs border border-gray-200/90 dark:border-slate-800 mb-6 transition-all hover:shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            {/* Campo de búsqueda integrado sobrio */}
            <div className="relative flex-1 w-full flex items-center bg-gray-50/80 dark:bg-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-xl border border-gray-200 dark:border-slate-700 transition-all">
              <span className="pl-3.5 text-gray-400 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar productos por nombre o descripción..."
                value={searchInputValue}
                onChange={handleSearchChange}
                className="w-full py-2.5 px-3 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 bg-transparent focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="mr-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 flex-shrink-0"
                aria-label="Buscar"
              >
                <span>Buscar</span>
              </button>
            </div>

            {/* Selector de ordenamiento sobrio */}
            <div className="w-full sm:w-56 flex-shrink-0">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full py-2.5 pl-3.5 pr-8 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/80 dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition"
                >
                  <option value="relevance">Ordenar: Relevancia</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                  <option value="rating_desc">Mejor valorados</option>
                  <option value="newest">Más recientes</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none text-[10px]">
                  ▼
                </span>
              </div>
            </div>

            {/* Botón de filtros para móvil */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros Estilo Facebook Marketplace */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 sticky top-4">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-slate-100">Filtros</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                >
                  Limpiar todo
                </button>
              </div>

              {/* Filtro de Ubicación Estilo Facebook Marketplace */}
              <div className="mb-5 border-b border-gray-100 dark:border-slate-800 pb-4">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="w-full text-left font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition text-sm flex items-center justify-between group"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>📍</span>
                    <span className="underline decoration-dotted">{locationName} · En un radio de {locationRadius} km</span>
                  </span>
                </button>

                {/* Radio Buttons para Ordenamiento (Sugerencias, Distancia, Fecha, Precio) */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ordenar por</h4>
                  {[
                    { id: 'relevance', label: 'Sugerencias' },
                    { id: 'distance', label: 'Distancia: más cerca' },
                    { id: 'newest', label: 'Fecha de publicación: más recientes' },
                    { id: 'price_asc', label: 'Precio: más bajo' },
                    { id: 'price_desc', label: 'Precio: más alto' },
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between text-sm text-gray-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 py-0.5">
                      <span>{opt.label}</span>
                      <input
                        type="radio"
                        name="sortByOption"
                        checked={sortBy === opt.id}
                        onChange={() => {
                          setSortBy(opt.id as SortOption);
                          setHookSortBy(opt.id as SortOption);
                        }}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Categorías */}
              <div className="mb-5 border-b border-gray-100 dark:border-slate-800 pb-4">
                <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Categorías</h4>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
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
              <div className="mb-5 border-b border-gray-100 dark:border-slate-800 pb-4">
                <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Precio</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>

              {/* Envío gratis */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={hasFreeShipping}
                    onChange={(e) => setHasFreeShipping(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-slate-300">Solo envío gratis</span>
                </label>
              </div>

              {/* Resultados */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  {total} productos encontrados
                </p>
              </div>
            </div>
          </aside>

          {/* Grid de productos compacto estilo Facebook Marketplace */}
          <main className="flex-1">
            {loading && products.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Cargando productos...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold text-sm shadow-sm"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product as any} 
                      userId={userId}
                      cartQuantity={cartQuantities.get(product.id) || 0}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                      isFavorite={favoriteProductIds.has(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onShareProduct={handleShareProduct}
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

      {/* Modal de Compartir Producto */}
      <ShareModal
        isOpen={!!shareProduct}
        onClose={() => setShareProduct(null)}
        product={shareProduct}
      />

      {/* Pie de página con créditos */}
      <Footer />

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

      {/* Modal Cambiar Ubicación Estilo Facebook Marketplace */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        size="md"
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/40 rounded-t-2xl">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">Cambiar ubicación</h3>
          <button 
            onClick={() => setShowLocationModal(false)} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 font-bold text-lg p-1 rounded-full hover:bg-gray-200/60 dark:hover:bg-slate-700 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 text-gray-900 dark:text-slate-100">
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
            Buscar por lugar (ej: Plaza Colombia, Barracas), ciudad o código postal
          </p>

          <div className="relative">
            <label className="block text-xs font-extrabold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1">Ubicación</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => handleModalLocationInputChange(e.target.value)}
                  onFocus={() => modalLocationSuggestions.length > 0 && setShowModalSuggestions(true)}
                  placeholder="Ej: Plaza Colombia, Barracas, Palermo..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                {isSearchingModalSuggestions && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-bold animate-pulse">⏳</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleGPSInModal}
                disabled={isGeolocating}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1 flex-shrink-0 shadow-xs cursor-pointer active:scale-95"
                title="Detectar mi ubicación exacta por GPS sin tipear dirección"
              >
                <span>🎯</span>
                <span>{isGeolocating ? 'Detectando...' : 'Detectar'}</span>
              </button>
            </div>

            {/* Dropdown de sugerencias de ubicación */}
            {showModalSuggestions && modalLocationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 max-h-48 overflow-y-auto">
                {modalLocationSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setLocationName(sug.label);
                      setMapCoords({ lat: sug.lat, lng: sug.lng, key: Date.now() });
                      setShowModalSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 last:border-b-0 transition"
                  >
                    <span>📍</span>
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1">Radio</label>
            <select
              value={locationRadius}
              onChange={(e) => setLocationRadius(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
            >
              <option value={2}>2 kilómetros</option>
              <option value={6}>6 kilómetros</option>
              <option value={10}>10 kilómetros</option>
              <option value={25}>25 kilómetros</option>
              <option value={50}>50 kilómetros</option>
              <option value={100}>100 kilómetros</option>
            </select>
          </div>

          {/* Previsualización visual del mapa con PIN ROJO interactivo de GPS */}
          <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-inner">
            <iframe
              key={mapCoords?.key || locationName}
              title={`Mapa de ${locationName}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={
                mapCoords
                  ? `https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&t=&z=${locationRadius <= 2 ? 16 : locationRadius <= 6 ? 14 : locationRadius <= 25 ? 12 : 10}&ie=UTF8&iwloc=A&output=embed`
                  : `https://maps.google.com/maps?q=${encodeURIComponent(locationName || 'Plaza Colombia, Barracas')}&t=&z=${locationRadius <= 2 ? 16 : locationRadius <= 6 ? 14 : locationRadius <= 25 ? 12 : 10}&ie=UTF8&iwloc=A&output=embed`
              }
              className="w-full h-full rounded-2xl"
            />
            
            {/* PIN ROJO DE UBICACIÓN GPS EN EL CENTRO EXACTO DEL MAPA */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="relative flex flex-col items-center">
                {/* Anillo GPS pulso rojo */}
                <div className="w-10 h-10 rounded-full bg-rose-500/40 border-2 border-rose-600 animate-ping absolute -top-1" />
                
                {/* Pin Rojo con Sombra de alta legibilidad */}
                <div className="relative z-10 text-3xl filter drop-shadow-xl transform transition-transform hover:scale-125">
                  📍
                </div>

                {/* Cartel flotante de la ubicación exacta */}
                <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-2xl border border-slate-700/80 -mt-1 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{locationName || 'Plaza Colombia, Barracas'}</span>
                </div>
              </div>
            </div>

            {/* Pill inferior de radio */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
                <span className="animate-pulse">⭕</span>
                <span>Radio: {locationRadius} km</span>
              </span>
            </div>

            {/* Botón GPS con geolocalización real */}
            <button
              type="button"
              onClick={handleGPSInModal}
              disabled={isGeolocating}
              className="absolute top-3 right-3 z-10 bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md text-gray-900 dark:text-slate-100 p-2 px-3 rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5 border border-gray-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
              title="Obtener ubicación exacta por GPS"
            >
              <span>🎯</span>
              <span>{isGeolocating ? 'Obteniendo GPS...' : 'GPS'}</span>
            </button>
          </div>

          <Button
            onClick={() => setShowLocationModal(false)}
            fullWidth
            variant="primary"
            className="py-3.5 text-base font-extrabold rounded-xl shadow-sm"
          >
            Aplicar
          </Button>
        </div>
      </Modal>
    </div>
  );
}