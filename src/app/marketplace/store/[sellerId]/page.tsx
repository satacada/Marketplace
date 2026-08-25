/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * @description Página de Vitrina Dedicada de Tienda (/marketplace/store/[sellerId]).
 *              Muestra el perfil completo de la tienda, sus estadísticas y
 *              sus productos publicados con buscador y filtros delimitados a esta tienda.
 * @module Presentation/Pages/Marketplace/Store
 */

'use client';

import { useState, useEffect, useMemo, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareModal from '@/components/marketplace/ShareModal';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAdvancedProducts } from '@/features/products/hooks/useAdvancedProducts';
import { SortOption } from '@/features/products/types/product-filters.types';

type SellerProfile = {
  id: string;
  email: string | null;
  store_name: string | null;
  is_trusted_seller: boolean;
  approved_products_count: number;
  city: string | null;
  address: string | null;
};

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_urls: string[] | null;
  category_id: string | null;
  seller_id: string;
  is_deleted: boolean;
  location_name?: string | null;
  categories: { name: string } | null;
  profiles: { store_name: string | null; email: string | null } | null;
};

export default function StoreShowcasePage({ params }: { params: Promise<{ sellerId: string }> }) {
  const resolvedParams = use(params);
  const sellerId = resolvedParams.sellerId;

  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || null;
  const { cart, addToCart } = useCart(userId);
  const { orders } = useOrders('buyer', userId);
  const { categories } = useCategories({ level: 1 });

  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);

  // Estados de filtros delimitados a esta tienda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
  const [shareProduct, setShareProduct] = useState<{ id: string; title: string; price: number; image_url?: string | null } | null>(null);

  // Filtros delimitados exclusivamente a este sellerId
  const filters = useMemo(() => ({
    sellerId,
    searchQuery,
    categoryId: selectedCategoryId || undefined,
    sortBy,
    page: 1,
    limit: 50,
  }), [sellerId, searchQuery, selectedCategoryId, sortBy]);

  const { products, loading: loadingProducts, total } = useAdvancedProducts(filters);

  // Cargar perfil del vendedor
  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setLoadingSeller(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, store_name, is_trusted_seller, approved_products_count, city, address')
          .eq('id', sellerId)
          .single();

        if (data) {
          setSellerProfile(data);
        }
      } catch (err) {
        console.error('Error al cargar perfil de la tienda:', err);
      } finally {
        setLoadingSeller(false);
      }
    };

    fetchSellerProfile();
  }, [sellerId]);

  // Cargar favoritos del usuario
  useEffect(() => {
    if (!userId) return;
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);
      if (data) {
        setFavoriteProductIds(new Set(data.map(f => f.product_id)));
      }
    };
    fetchFavorites();
  }, [userId]);

  const cartQuantities = useMemo(() => {
    const map = new Map<string, number>();
    cart.items.forEach(item => {
      map.set(item.product_id, item.quantity);
    });
    return map;
  }, [cart.items]);

  const handleAddToCart = useCallback((id: string, productInfo?: { title: string; price?: number; image_url: string | null; seller_id: string }) => {
    addToCart({ productId: id, quantity: 1 }, productInfo);
  }, [addToCart]);

  const handleViewDetails = useCallback((id: string) => {
    router.push(`/marketplace/product/${id}`);
  }, [router]);

  const handleToggleFavorite = useCallback(async (productId: string) => {
    if (!userId) return;
    try {
      if (favoriteProductIds.has(productId)) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
        setFavoriteProductIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
        setFavoriteProductIds(prev => new Set(prev).add(productId));
      }
    } catch (err) {
      console.error('Error favoritos:', err);
    }
  }, [userId, favoriteProductIds]);

  const handleShareProduct = useCallback((product: any) => {
    const title = product.title;
    const price = product.price;
    const id = product.id;
    const imageUrl = product.image_urls?.[0] || null;

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

  const storeDisplayName = sellerProfile?.store_name && sellerProfile.store_name !== 'DE TODO'
    ? sellerProfile.store_name
    : 'Tienda Oficial';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Header 
          cartItemCount={cart.itemCount} 
          cartTotal={cart.total} 
          ordersCount={orders.length} 
        />

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition flex items-center gap-1">
              <span>←</span> Volver al Marketplace Principal
            </Link>
          </div>

          {/* Banner de la Tienda del Vendedor */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md flex-shrink-0">
                  🏪
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{storeDisplayName}</h1>
                    {sellerProfile?.is_trusted_seller && (
                      <span className="bg-emerald-400 text-emerald-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        ✓ Vendedor Verificado
                      </span>
                    )}
                  </div>

                  <p className="text-blue-100 text-xs sm:text-sm mt-1 flex items-center gap-2 flex-wrap font-medium">
                    <span>📍 {sellerProfile?.city || 'Barracas, Buenos Aires'}</span>
                    <span>•</span>
                    <span>📦 {total} producto{total !== 1 ? 's' : ''} en catálogo</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs font-semibold flex items-center gap-3 self-stretch sm:self-auto justify-between">
                <div>
                  <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Estado de Tienda</p>
                  <p className="text-white font-extrabold text-sm">Abierta y Activa 🟢</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buscador e Identificación de Catálogo de Tienda */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xs border border-gray-200/90 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Buscador interno de la tienda */}
              <div className="relative flex-1 w-full flex items-center bg-gray-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-xl border border-gray-200 transition-all">
                <span className="pl-3.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder={`Buscar dentro de ${storeDisplayName}...`}
                  value={searchInputValue}
                  onChange={(e) => {
                    setSearchInputValue(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
                />
              </div>

              {/* Selector de categorías de esta tienda */}
              <div className="w-full sm:w-48 flex-shrink-0">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Selector de Ordenamiento */}
              <div className="w-full sm:w-48 flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="relevance">Ordenar: Relevancia</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Productos Exclusivos de la Tienda */}
          {loadingProducts ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-xs text-gray-500 font-medium">Cargando catálogo de {storeDisplayName}...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200/90 text-center my-6">
              <span className="text-5xl block mb-3">📦</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Esta tienda aún no tiene productos publicados aquí</h3>
              <p className="text-xs text-gray-500 mb-4">Intenta borrar los términos de búsqueda o cambiar de categoría.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchInputValue('');
                  setSelectedCategoryId('');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                Ver todos los productos de esta tienda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mb-12">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition group">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => handleViewDetails(product.id)}>
                    {product.image_urls?.[0] ? (
                      <img src={product.image_urls[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📦</div>
                    )}

                    {/* Botón de Favorito */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-xs hover:scale-110 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill={favoriteProductIds.has(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 truncate hover:text-blue-600 transition cursor-pointer" onClick={() => handleViewDetails(product.id)}>
                        {product.title}
                      </h4>
                      <p className="text-sm font-extrabold text-blue-600 mt-1">${product.price.toLocaleString('es-AR')}</p>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500 font-medium">
                        📍 {product.location_name || 'Barracas, BA'}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Compartir */}
                        <button
                          type="button"
                          onClick={() => handleShareProduct(product)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center transition"
                          title="Compartir"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>

                        {/* Carrito con Contador */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product.id, { title: product.title, price: product.price, image_url: product.image_urls?.[0] || null, seller_id: product.seller_id })}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                              (cartQuantities.get(product.id) || 0) > 0
                                ? 'bg-emerald-500 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {(cartQuantities.get(product.id) || 0) > 0 ? '✓' : '🛒'}
                          </button>
                          {(cartQuantities.get(product.id) || 0) > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-800 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                              {cartQuantities.get(product.id)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={!!shareProduct}
        onClose={() => setShareProduct(null)}
        product={shareProduct}
      />

      <Footer />
    </div>
  );
}
