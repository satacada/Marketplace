/**
 * ============================================================================
 * FILE: base.repository.ts
 * ============================================================================
 * 
 * @description Repositorio base con operaciones CRUD genéricas.
 *              Todos los repositories específicos extienden de este.
 *              Proporciona métodos estándar para crear, leer, actualizar y eliminar.
 * 
 * @module Infrastructure/Repositories
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/database/supabase.client
 * - @/shared/types/api.types.ts
 * 
 * @related-files
 * - @/infrastructure/repositories/product.repository.ts
 * - @/infrastructure/repositories/user.repository.ts
 * 
 * @exports
 * - BaseRepository (class)
 * 
 * ============================================================================
 */

import { supabase } from '@/infrastructure/database/supabase.client';
import { SupabaseError, QueryOptions } from '@/shared/types/api.types';

export class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Construye una query Supabase con opciones
   */
  protected buildQuery(options?: QueryOptions) {
    let query: any = supabase.from(this.tableName);

    if (options?.select) {
      query = query.select(options.select);
    } else {
      query = query.select('*');
    }

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return query;
  }

  /**
   * Maneja errores de Supabase de forma estandarizada
   */
  protected handleError(error: any): never {
    const supabaseError: SupabaseError = {
      message: error.message || 'Error desconocido',
      code: error.code,
      details: error.details,
      hint: error.hint,
    };
    throw supabaseError;
  }

  /**
   * Obtiene todos los registros con filtros opcionales
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    const query = this.buildQuery(options);
    const { data, error } = await query;

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene un registro por ID
   */
  async findById(id: string, select?: string): Promise<T | null> {
    const query = supabase
      .from(this.tableName)
      .select(select || '*')
      .eq('id', id)
      .single();

    const { data, error } = await query;

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      this.handleError(error);
    }
    return data as T;
  }

  /**
   * Busca registros que coincidan con los filtros
   */
  async findOne(filters: Record<string, any>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .match(filters)
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      this.handleError(error);
    }
    return data;
  }

  /**
   * Crea un nuevo registro
   */
  async create(data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data as any)
      .select()
      .single();

    if (error) this.handleError(error);
    return result as T;
  }

  /**
   * Crea múltiples registros
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data as any)
      .select();

    if (error) this.handleError(error);
    return (result || []) as T[];
  }

  /**
   * Actualiza un registro por ID
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();

    if (error) this.handleError(error);
    return result as T;
  }

  /**
   * Actualiza múltiples registros que coinciden con filtros
   */
  async updateMany(filters: Record<string, any>, data: Partial<T>): Promise<T[]> {
    let query = supabase.from(this.tableName).update(data as any);

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data: result, error } = await query.select();

    if (error) this.handleError(error);
    return (result || []) as T[];
  }

  /**
   * Soft delete (marca como eliminado)
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ is_deleted: true } as any)
      .eq('id', id);

    if (error) this.handleError(error);
  }

  /**
   * Hard delete (elimina permanentemente)
   */
  async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) this.handleError(error);
  }

  /**
   * Cuenta registros con filtros opcionales
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) this.handleError(error);
    return count || 0;
  }

  /**
   * Verifica si existe un registro con los filtros dados
   */
  async exists(filters: Record<string, any>): Promise<boolean> {
    const count = await this.count(filters);
    return count > 0;
  }
}
