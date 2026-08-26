'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '@/components/marketplace/ImageGallery';
import Header from '@/components/layout/Header';
import { useCart } from '@/features/cart/hooks/useCart';
import { useOrders } from '@/features/orders/hooks/useOrders';

type FavoriteProductRaw = {
  id: string;
  product_id: string;
  created_at: string;
  products: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    stock: number;
    image_urls: string[] | null;
    seller_id: string;
    categories: { name: string }[];
    profiles: { store_name: string | null }[];
  };
};

type FavoriteProduct = {
  id: string;
  product_id: string;
  created_at: string;
  products: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    stock: number;
    image_urls: string[] | null;
    seller_id: string;
    categories: { name: string } | null;
    profiles: { store_name: string | null } | null;
  };
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          title,
          description,
          price,
          stock,
          image_urls,
          seller_id,
          categories (name),
          profiles (store_name)
        )
      `)
      .eq('user_id', user.id)
      .eq('products.is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar favoritos:', error);
    } else if (data) {
      // Mapear para convertir arrays a objetos
      const mappedFavorites = (data as unknown as FavoriteProductRaw[])?.map(fav => ({
        ...fav,
        products: {
          ...fav.products,
          categories: Array.isArray(fav.products.categories) ? fav.products.categories[0] : null,
          profiles: Array.isArray(fav.products.profiles) ? fav.products.profiles[0] : null
        }
      })) || [];
      
      setFavorites(mappedFavorites);
    }
    setLoading(false);
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (error) {
      alert('Error al quitar de favoritos: ' + error.message);
    } else {
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-center py-8">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header title="Mis Favoritos" />

        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-2xs text-center border border-gray-200/90 dark:border-slate-800">
            <p className="text-6xl mb-4">❤️</p>
            <p className="text-gray-600 dark:text-slate-300 text-lg font-bold mb-4">No tienes productos favoritos aún.</p>
            <Link 
              href="/marketplace" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-bold transition inline-block shadow-xs"
            >
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((fav) => {
              const product = fav.products;
              const isOwnProduct = userId && product.seller_id === userId;

              return (
                <div 
                  key={fav.id} 
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row gap-6 p-6 hover:shadow-md transition-all duration-200"
                >
                  {/* Columna Izquierda: Galería de Fotos del Producto */}
                  <div className="w-full lg:w-1/2 flex-shrink-0">
                    <ImageGallery images={product.image_urls || []} />
                  </div>

                  {/* Columna Derecha: Detalles del Producto & Acciones (Llena el espacio libre en pantalla grande) */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="mb-2">
                        <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
                          {product.categories?.name || 'Sin categoría'}
                        </span>
                      </div>
                      
                      <Link href={`/marketplace/product/${product.id}`} className="block group">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium mb-4">
                        {product.description || 'Sin descripción adicional del vendedor.'}
                      </p>

                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                          ${product.price?.toLocaleString('es-CL')}
                        </span>
                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'}`}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                      {isOwnProduct ? (
                        <button disabled className="w-full py-3 rounded-xl font-extrabold text-xs bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400 cursor-not-allowed">
                          Es tu propio producto
                        </button>
                      ) : (
                        <Link 
                          href={`/marketplace/product/${product.id}`}
                          className="block w-full text-center py-3 rounded-xl font-extrabold text-xs bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
                        >
                          Ver detalle del producto
                        </Link>
                      )}

                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="w-full py-2.5 rounded-xl font-extrabold text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>❤️</span>
                        <span>Quitar de favoritos</span>
                      </button>

                      <div className="pt-3 mt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Vendido por:</span>
                        <span className="font-extrabold text-gray-800 dark:text-slate-200">
                          {product.profiles?.store_name || 'Tienda sin nombre'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}