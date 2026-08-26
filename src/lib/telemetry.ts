/**
 * ============================================================================
 * FILE: telemetry.ts
 * ============================================================================
 * 
 * @description Servicio cliente para el rastreo y envío de eventos de telemetría
 *              (vistas, clics, tiempos de permanencia, búsquedas)
 *              para alimentar el motor de perfilamiento por IA.
 * 
 * @module Infrastructure/Services/Telemetry
 * ============================================================================
 */

import { supabase } from '@/lib/supabase';

export type UserEventType = 
  | 'view' 
  | 'hover_photo' 
  | 'search' 
  | 'favorite' 
  | 'cart_add' 
  | 'cart_abandon' 
  | 'ask_question' 
  | 'visual_search';

export type TelemetryPayload = {
  eventType: UserEventType;
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  dwellTimeSeconds?: number;
  metadata?: Record<string, any>;
};

// Generador de ID de Sesión Anónima para visitantes no autenticados
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sessionId = localStorage.getItem('mp_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('mp_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Registra un evento de telemetría de usuario de forma asíncrona no bloqueante.
 */
export async function trackUserEvent(payload: TelemetryPayload): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId();
    
    // Obtener ID del usuario autenticado si existe
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('user_event_logs').insert({
      user_id: user?.id || null,
      session_id: sessionId,
      event_type: payload.eventType,
      product_id: payload.productId || null,
      category_id: payload.categoryId || null,
      search_query: payload.searchQuery || null,
      dwell_time_seconds: payload.dwellTimeSeconds || 0,
      metadata: payload.metadata || {}
    });
  } catch (error) {
    // Silencioso para no perturbar la navegación del usuario
    console.debug('Telemetry Event Log:', error);
  }
}
