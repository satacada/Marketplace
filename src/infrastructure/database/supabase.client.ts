/**
 * ============================================================================
 * FILE: supabase.client.ts
 * ============================================================================
 * 
 * @description Cliente de Supabase configurado para la aplicación.
 *              Maneja autenticación, conexión a base de datos y storage.
 * 
 * @module Infrastructure/Database
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @supabase/supabase-js
 * 
 * @related-files
 * - @/infrastructure/repositories/base.repository.ts
 * - @/infrastructure/storage/image.storage.ts
 * 
 * @exports
 * - supabase (client instance)
 * 
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

// URL de redirección predeterminada (segura para SSR)
const defaultRedirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  : 'http://localhost:3000/auth/callback';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    // Configurar URLs de redirección para recuperación de contraseña
    //redirectTo: defaultRedirectUrl,
  },
});

// Manejar errores de refresh token (solo en cliente)
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED' && !session) {
      console.log('Sesión expirada, limpiando...');
      localStorage.clear();
    }
  });
}
