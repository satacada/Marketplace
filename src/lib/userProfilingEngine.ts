/**
 * ============================================================================
 * FILE: userProfilingEngine.ts
 * ============================================================================
 * 
 * @description FASE 2: Motor de Consolidación de Perfil de Usuario.
 *              Analiza los eventos almacenados en `user_event_logs` y genera
 *              un perfil ponderado de categorías preferidas, rango de precios
 *              y score de intención de compra.
 * 
 * @module Infrastructure/Services/UserProfilingEngine
 * ============================================================================
 */

import { supabase } from '@/lib/supabase';

export type UserBehaviorProfile = {
  userId?: string | null;
  sessionId?: string;
  topCategoryIds: string[];
  preferredPriceMin: number;
  preferredPriceMax: number;
  interestKeywords: string[];
  purchaseIntentScore: number; // Score de 0 a 100
};

// Ponderación de pesos según tipo de interacción
const EVENT_WEIGHTS: Record<string, number> = {
  view: 1,
  hover_photo: 2,
  search: 3,
  visual_search: 4,
  ask_question: 5,
  favorite: 6,
  cart_add: 8,
  cart_abandon: 10,
};

/**
 * Procesa los eventos de telemetría recientes del usuario/sesión
 * y calcula su perfil consolidado de comportamiento.
 */
export async function consolidateUserBehaviorProfile(
  userId?: string | null,
  sessionId?: string
): Promise<UserBehaviorProfile> {
  // Configuración por defecto para visitantes nuevos
  const defaultProfile: UserBehaviorProfile = {
    userId,
    sessionId,
    topCategoryIds: [],
    preferredPriceMin: 0,
    preferredPriceMax: 1000000,
    interestKeywords: [],
    purchaseIntentScore: 0,
  };

  try {
    // 1. Obtener los últimos 50 eventos del usuario o de la sesión anónima
    let query = supabase
      .from('user_event_logs')
      .select('event_type, category_id, search_query, product_id, products(price, category_id, title)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else {
      return defaultProfile;
    }

    const { data: events, error } = await query;
    if (error || !events || events.length === 0) {
      return defaultProfile;
    }

    // 2. Acumular puntuación por categoría
    const categoryScores: Record<string, number> = {};
    const observedPrices: number[] = [];
    const keywordsCount: Record<string, number> = {};
    let totalIntentScore = 0;

    events.forEach((evt) => {
      const weight = EVENT_WEIGHTS[evt.event_type] || 1;
      totalIntentScore += weight;

      // Categóría desde el evento o producto asociado
      const categoryId = evt.category_id || (evt.products as any)?.category_id;
      if (categoryId) {
        categoryScores[categoryId] = (categoryScores[categoryId] || 0) + weight;
      }

      // Precios observados en los productos interactuados
      const price = (evt.products as any)?.price;
      if (typeof price === 'number' && price > 0) {
        observedPrices.push(price);
      }

      // Palabras clave en búsquedas o títulos
      const textToScan = evt.search_query || (evt.products as any)?.title || '';
      if (textToScan) {
        const words = textToScan.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
        words.forEach((w: string) => {
          keywordsCount[w] = (keywordsCount[w] || 0) + 1;
        });
      }
    });

    // 3. Ordenar categorías de mayor a menor interés
    const sortedCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .map(([catId]) => catId);

    // 4. Calcular rango de precios preferido (Min y Max razonable)
    let minPrice = 0;
    let maxPrice = 1000000;
    if (observedPrices.length > 0) {
      observedPrices.sort((a, b) => a - b);
      minPrice = Math.round(observedPrices[0] * 0.8);
      maxPrice = Math.round(observedPrices[observedPrices.length - 1] * 1.2);
    }

    // 5. Palabras clave más frecuentes
    const topKeywords = Object.entries(keywordsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    // 6. Normalizar el score de intención de compra (0 a 100)
    const normalizedIntentScore = Math.min(100, Math.round((totalIntentScore / 30) * 100));

    const computedProfile: UserBehaviorProfile = {
      userId,
      sessionId,
      topCategoryIds: sortedCategories.slice(0, 3),
      preferredPriceMin: minPrice,
      preferredPriceMax: maxPrice,
      interestKeywords: topKeywords,
      purchaseIntentScore: normalizedIntentScore,
    };

    // 7. Si el usuario está autenticado, guardar/actualizar en la base de datos
    if (userId) {
      await supabase.from('user_behavior_profiles').upsert({
        user_id: userId,
        top_categories: computedProfile.topCategoryIds,
        preferred_price_min: computedProfile.preferredPriceMin,
        preferred_price_max: computedProfile.preferredPriceMax,
        interest_keywords: computedProfile.interestKeywords,
        purchase_intent_score: computedProfile.purchaseIntentScore,
        updated_at: new Date().toISOString(),
      });
    }

    return computedProfile;
  } catch (err) {
    console.error('Error al consolidar perfil de usuario:', err);
    return defaultProfile;
  }
}
