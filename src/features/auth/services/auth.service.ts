/**
 * ============================================================================
 * FILE: auth.service.ts
 * ============================================================================
 * 
 * @description Servicio de autenticación que coordina operaciones de negocio.
 *              Valida reglas de negocio y coordina con repositorios y Supabase Auth.
 * 
 * @module Features/Auth/Services
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/database/supabase.client
 * - @/infrastructure/repositories/user.repository
 * - @/features/auth/types/auth.types.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @related-files
 * - @/features/auth/hooks/useAuth.ts
 * - @/features/auth/types/auth.types.ts
 * 
 * @exports
 * - authService (object)
 * 
 * ============================================================================
 */

import { supabase } from '@/infrastructure/database/supabase.client';
import { userRepository } from '@/infrastructure/repositories/user.repository';
import { 
  LoginInput, 
  RegisterInput, 
  AuthResponse, 
  UpdateProfileInput,
  Profile 
} from '../types/auth.types';
import { UserRole } from '@/shared/constants/app.constants';

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) throw error;

      // Obtener perfil del usuario
      const profile = await userRepository.findByUserId(data.user.id);

      return {
        user: data.user,
        profile,
      };
    } catch (error: any) {
      return {
        user: null,
        profile: null,
        error: error.message || 'Error al iniciar sesión',
      };
    }
  },

  /**
   * Registra un nuevo usuario
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) throw error;

      // El perfil se crea automáticamente via trigger en Supabase
      return {
        user: data.user,
        profile: null, // Se creará después de confirmar email
      };
    } catch (error: any) {
      return {
        user: null,
        profile: null,
        error: error.message || 'Error al registrar usuario',
      };
    }
  },

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Obtiene el usuario actual
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;
      if (!user) {
        return { user: null, profile: null };
      }

      const profile = await userRepository.findByUserId(user.id);

      return {
        user,
        profile,
      };
    } catch (error: any) {
      return {
        user: null,
        profile: null,
        error: error.message,
      };
    }
  },

  /**
   * Activa cuenta de vendedor para un usuario
   */
  async activateSeller(userId: string, storeName: string, storeDescription?: string): Promise<Profile> {
    try {
      const profile = await userRepository.findByUserId(userId);
      
      if (!profile) {
        throw new Error('Usuario no encontrado');
      }

      if (profile.role === 'seller') {
        throw new Error('El usuario ya es vendedor');
      }

      return await userRepository.updateStoreInfo(userId, storeName, storeDescription);
    } catch (error: any) {
      throw new Error(error.message || 'Error al activar vendedor');
    }
  },

  /**
   * Actualiza perfil de usuario
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
    try {
      const profile = await userRepository.findByUserId(userId);
      
      if (!profile) {
        throw new Error('Usuario no encontrado');
      }

      return await userRepository.update(userId, input);
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  },

  /**
   * Reinicia contraseña
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/reset?email=${encodeURIComponent(email)}`
        : `http://localhost:3000/auth/reset?email=${encodeURIComponent(email)}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Error al enviar email de recuperación');
    }
  },

  /**
   * Actualiza contraseña
   */
  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar contraseña');
    }
  },

  /**
   * Verifica si el usuario tiene un rol específico
   */
  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const profile = await userRepository.findByUserId(userId);
      return profile?.role === role;
    } catch {
      return false;
    }
  },

  /**
   * Obtiene todos los vendedores (para admin)
   */
  async getAllSellers(): Promise<Profile[]> {
    return await userRepository.findAllSellers();
  },

  /**
   * Obtiene todos los compradores (para admin)
   */
  async getAllBuyers(): Promise<Profile[]> {
    return await userRepository.findAllBuyers();
  },
};
