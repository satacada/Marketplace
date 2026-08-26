/**
 * ============================================================================
 * FILE: useFavoritesPage.ts
 * ============================================================================
 * 
 * @description Custom Hook para controlar la lista de productos favoritos del usuario (SOLID / SRP).
 * 
 * @module Features/Favorites/Hooks/useFavoritesPage
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';

export function useFavoritesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id || null;
  const { addToCart } = useCart(userId);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (user) {
      loadFavorites();
    }
  }, [user, authLoading]);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, products(*, categories(name), profiles(store_name, is_trusted_seller))')
        .eq('user_id', user.id);

      if (!error && data) {
        setFavorites(data);
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== favId));
    await supabase.from('favorites').delete().eq('id', favId);
  };

  const handleAddToCart = (product: any) => {
    addToCart({ productId: product.id, quantity: 1 }, product);
  };

  return {
    favorites,
    loading: loading || authLoading,
    handleRemoveFavorite,
    handleAddToCart,
    router,
  };
}
