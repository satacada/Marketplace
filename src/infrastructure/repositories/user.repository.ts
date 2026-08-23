/**
 * ============================================================================
 * FILE: user.repository.ts
 * ============================================================================
 * 
 * @description Repositorio para operaciones de usuarios y perfiles en Supabase.
 *              Maneja CRUD de perfiles y operaciones de autenticación.
 * 
 * @module Infrastructure/Repositories
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/base.repository
 * - @/infrastructure/database/supabase.client
 * - @/features/auth/types/auth.types.ts
 * 
 * @related-files
 * - @/features/auth/services/auth.service.ts
 * - @/features/auth/types/auth.types.ts
 * 
 * @exports
 * - UserRepository (class)
 * - userRepository (instance)
 * 
 * ============================================================================
 */

import { BaseRepository } from './base.repository';
import { supabase } from '@/infrastructure/database/supabase.client';
import { Profile } from '@/features/auth/types/auth.types';
import { UserRole } from '@/shared/constants/app.constants';

export class UserRepository extends BaseRepository<Profile> {
  constructor() {
    super('profiles');
  }

  /**
   * Obtiene perfil por ID de usuario
   */
  async findByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      this.handleError(error);
    }
    return data;
  }

  /**
   * Obtiene perfil por email
   */
  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      this.handleError(error);
    }
    return data;
  }

  /**
   * Actualiza rol de usuario
   */
  async updateRole(userId: string, role: UserRole): Promise<Profile> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Actualiza información de tienda del vendedor
   */
  async updateStoreInfo(userId: string, storeName: string, storeDescription?: string): Promise<Profile> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ 
        store_name: storeName,
        store_description: storeDescription,
        role: 'seller' as UserRole
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Obtiene todos los vendedores
   */
  async findAllSellers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('role', 'seller')
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene todos los compradores
   */
  async findAllBuyers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('role', 'buyer')
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Verifica si un email ya está registrado
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.count({ email });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
