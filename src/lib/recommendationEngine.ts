/**
 * ============================================================================
 * FILE: recommendationEngine.ts
 * ============================================================================
 * 
 * @description FASE 3: Motor Algorítmico de Recomendaciones por IA.
 *              Cruza el perfil de comportamiento consolidado del usuario con el
 *              catálogo activo de productos para entregar sugerencias altamente
 *              personalizadas.
 * 
 * @module Infrastructure/Services/RecommendationEngine
 * ============================================================================
 */

import { supabase } from '@/lib/supabase';
import { consolidateUserBehaviorProfile, UserBehaviorProfile } from '@/lib/userProfilingEngine';

export type RecommendedProduct = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category_name?: string | null;
  seller_name?: string | null;
  matchScore: number; // Porcentaje de coincidencia (0 - 100%)
  reasonBadge: string; // Explicación de la recomendación (ej: 'Basado en tus búsquedas recientes')
};

export type GetRecommendationsParams = {
  userId?: string | null;
  sessionId?: string;
  limit?: number;
};

/**
 * Genera la lista de productos recomendados dinámicamente para el visitante o comprador.
 */
export async function getPersonalizedRecommendations(
  params: GetRecommendationsParams
): Promise<RecommendedProduct[]> {
  const limit = params.limit || 8;
  
  try {
    // 1. Obtener perfil consolidado del usuario/sesión
    const profile = await consolidateUserBehaviorProfile(params.userId, params.sessionId);
    
    // 2. Traer productos activos del marketplace
    const { data: productsData, error } = await supabase
      .from('products')
      .select('id, title, description, price, stock, image_urls, category_id, seller_id, categories(name), profiles(store_name)')
      .gt('stock', 0)
      .limit(60);

    if (error || !productsData || productsData.length === 0) {
      return [];
    }

    // 3. Evaluar cada producto con el algoritmo de scoring de IA
    const scoredProducts: RecommendedProduct[] = productsData.map((item) => {
      let score = 50; // Puntaje base para productos generales
      let reasonBadge = 'Recomendado para ti';

      const catName = Array.isArray(item.categories) 
        ? item.categories[0]?.name 
        : (item.categories as any)?.name;
      const storeName = Array.isArray(item.profiles) 
        ? item.profiles[0]?.store_name 
        : (item.profiles as any)?.store_name;

      // A) Coincidencia de Categoría (Peso: +30 pts)
      if (profile.topCategoryIds.includes(item.category_id)) {
        score += 30;
        reasonBadge = 'Basado en las categorías que exploraste';
      }

      // B) Coincidencia de Rango de Precio (Peso: +15 pts)
      if (item.price >= profile.preferredPriceMin && item.price <= profile.preferredPriceMax) {
        score += 15;
        if (score > 65 && reasonBadge === 'Recomendado para ti') {
          reasonBadge = 'Coincide con tu rango de presupuesto';
        }
      }

      // C) Coincidencia de Palabras Clave (Peso: +15 pts)
      const itemTitleLower = item.title.toLowerCase();
      const keywordMatched = profile.interestKeywords.some(kw => itemTitleLower.includes(kw));
      if (keywordMatched) {
        score += 15;
        reasonBadge = 'Basado en tus búsquedas recientes';
      }

      // Normalizar puntaje a máximo 99%
      const matchScore = Math.min(99, Math.max(65, score));

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        stock: item.stock,
        image_url: item.image_urls?.[0] || null,
        category_name: catName || 'General',
        seller_name: storeName || 'Tienda Oficial',
        matchScore,
        reasonBadge,
      };
    });

    // 4. Ordenar por Score de Coincidencia de mayor a menor y limitar cantidad
    const finalRecommendations = scoredProducts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return finalRecommendations;
  } catch (err) {
    console.error('Error al generar recomendaciones de IA:', err);
    return [];
  }
}
