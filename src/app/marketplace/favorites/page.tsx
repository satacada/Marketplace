'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '@/components/marketplace/ImageGallery';
import Header from '@/components/layout/Header';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Header title="Mis Favoritos" />

        {favorites.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
            <p className="text-6xl mb-4">❤️</p>
            <p className="text-gray-500 text-lg mb-4">No tienes productos favoritos aún.</p>
            <Link 
              href="/marketplace" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition inline-block"
            >
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const product = fav.products;
              const isOwnProduct = userId && product.seller_id === userId;

              return (
                <div key={fav.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                  <Link href={`/marketplace/product/${product.id}`} className="block">
                    <ImageGallery images={product.image_urls || []} />
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <Link href={`/marketplace/product/${product.id}`} className="block mb-2">
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {product.categories?.name || 'Sin categoría'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    
                    {isOwnProduct ? (
                      <button disabled className="w-full py-2 rounded font-medium bg-gray-200 text-gray-500 cursor-not-allowed mb-2">
                        Es tu propio producto
                      </button>
                    ) : (
                      <Link 
                        href={`/marketplace/product/${product.id}`}
                        className="block w-full text-center py-2 rounded font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition mb-2"
                      >
                        Ver detalle
                      </Link>
                    )}

                    <button
                      onClick={() => handleRemoveFavorite(fav.id)}
                      className="w-full py-2 rounded font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      ❤️ Quitar de favoritos
                    </button>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400">Vendido por:</p>
                      <p className="text-sm font-medium text-gray-700">
                        {product.profiles?.store_name || 'Tienda sin nombre'}
                      </p>
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