/**
 * ============================================================================
 * FILE: auth.types.ts
 * ============================================================================
 * 
 * @description Tipos específicos para el módulo de autenticación.
 *              Define interfaces para usuarios, perfiles y operaciones de auth.
 * 
 * @module Features/Auth/Types
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/types/common.types.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @related-files
 * - @/features/auth/services/auth.service.ts
 * - @/features/auth/hooks/useAuth.ts
 * - @/infrastructure/repositories/user.repository.ts
 * 
 * @exports
 * - User
 * - Profile
 * - LoginInput
 * - RegisterInput
 * - AuthResponse
 * 
 * ============================================================================
 */

import { BaseEntity } from '@/shared/types/common.types';
import { UserRole } from '@/shared/constants/app.constants';

/**
 * Usuario de autenticación (Supabase Auth)
 */
export interface User {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Perfil de usuario en la base de datos
 */
export interface Profile extends BaseEntity {
  id: string;
  email: string;
  role: UserRole;
  store_name?: string;
  store_description?: string;
  phone?: string;
  avatar_url?: string;
  is_admin?: boolean;
}

/**
 * Input para login
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Input para registro
 */
export interface RegisterInput {
  email: string;
  password: string;
}

/**
 * Input para actualizar perfil
 */
export interface UpdateProfileInput {
  store_name?: string;
  store_description?: string;
  phone?: string;
  avatar_url?: string;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  user: User | null;
  profile: Profile | null;
  error?: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
