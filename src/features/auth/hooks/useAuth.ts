/**
 * ============================================================================
 * FILE: useAuth.ts
 * ============================================================================
 * 
 * @description Hook personalizado para gestionar autenticación.
 *              Proporciona estado y operaciones de autenticación.
 * 
 * @module Features/Auth/Hooks
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react (useState, useEffect, useCallback)
 * - @/features/auth/services/auth.service
 * - @/features/auth/types/auth.types.ts
 * 
 * @related-files
 * - @/features/auth/services/auth.service.ts
 * - @/features/auth/types/auth.types.ts
 * 
 * @exports
 * - useAuth (hook)
 * 
 * @example
 * ```tsx
 * const { user, profile, login, logout, isLoading } = useAuth();
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { AuthState, LoginInput, RegisterInput, UpdateProfileInput } from '../types/auth.types';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el usuario actual
   */
  const loadUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      const response = await authService.getCurrentUser();

      setState({
        user: response.user,
        profile: response.profile,
        isLoading: false,
        isAuthenticated: !!response.user,
      });
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuario');
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  /**
   * Inicia sesión
   */
  const login = useCallback(async (input: LoginInput) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      const response = await authService.login(input);

      if (response.error) {
        setError(response.error);
        setState(prev => ({ ...prev, isLoading: false })); // Asegurar que isLoading se restablezca
        return { success: false, error: response.error };
      }

      setState({
        user: response.user,
        profile: response.profile,
        isLoading: false,
        isAuthenticated: !!response.user,
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Registra un nuevo usuario
   */
  const register = useCallback(async (input: RegisterInput) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      const response = await authService.register(input);

      if (response.error) {
        setError(response.error);
        return { success: false, error: response.error };
      }

      setState({
        user: response.user,
        profile: response.profile,
        isLoading: false,
        isAuthenticated: !!response.user,
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cierra sesión
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
    }
  }, []);

  /**
   * Activa cuenta de vendedor
   */
  const activateSeller = useCallback(async (storeName: string, storeDescription?: string) => {
    try {
      if (!state.user) {
        throw new Error('Usuario no autenticado');
      }

      const profile = await authService.activateSeller(state.user.id, storeName, storeDescription);
      setState(prev => ({ ...prev, profile }));
      return { success: true, profile };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al activar vendedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [state.user]);

  /**
   * Actualiza perfil
   */
  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    try {
      if (!state.user) {
        throw new Error('Usuario no autenticado');
      }

      const profile = await authService.updateProfile(state.user.id, input);
      setState(prev => ({ ...prev, profile }));
      return { success: true, profile };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [state.user]);

  /**
   * Reinicia contraseña
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      await authService.resetPassword(email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al enviar email de recuperación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualiza contraseña (para recuperación)
   */
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar contraseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = useCallback(async (role: string) => {
    if (!state.user) return false;
    return await authService.hasRole(state.user.id, role as any);
  }, [state.user]);

  // Cargar usuario al montar
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    ...state,
    error,
    login,
    register,
    logout,
    activateSeller,
    updateProfile,
    resetPassword,
    updatePassword,
    hasRole,
    refresh: loadUser,
  };
}
