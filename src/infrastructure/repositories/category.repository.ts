/**
 * ============================================================================
 * FILE: category.repository.ts
 * ============================================================================
 * 
 * @description Repositorio para operaciones de categorías en Supabase.
 *              Maneja CRUD de categorías con soporte jerárquico.
 * 
 * @module Infrastructure/Repositories
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/base.repository
 * - @/infrastructure/database/supabase.client
 * - @/features/categories/types/category.types.ts
 * 
 * @related-files
 * - @/features/categories/services/category.service.ts
 * - @/features/categories/types/category.types.ts
 * 
 * @exports
 * - CategoryRepository (class)
 * - categoryRepository (instance)
 * 
 * ============================================================================
 */

import { BaseRepository } from './base.repository';
import { supabase } from '@/infrastructure/database/supabase.client';
import { Category, CategoryFilters } from '@/features/categories/types/category.types';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('categories');
  }

  /**
   * Obtiene categorías por nivel
   */
  async findByLevel(level: number): Promise<Category[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('level', level)
      // Temporalmente remover filtro is_active hasta que la columna exista
      // .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene categorías hijas de un padre
   */
  async findByParent(parentId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('parent_id', parentId)
      // Temporalmente remover filtro is_active hasta que la columna exista
      // .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene categorías raíz (nivel 1)
   */
  async findRootCategories(): Promise<Category[]> {
    return this.findByLevel(1);
  }

  /**
   * Obtiene árbol de categorías completo
   */
  async getCategoryTree(): Promise<Category[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      // Temporalmente remover filtro is_active hasta que la columna exista
      // .eq('is_active', true)
      .order('level', { ascending: true })
      .order('name', { ascending: true });

    if (error) this.handleError(error);
    
    const categories = data || [];
    return this.buildTree(categories);
  }

  /**
   * Construye árbol jerárquico desde lista plana
   */
  private buildTree(categories: Category[], parentId: string | null = null): Category[] {
    return categories.filter(cat => cat.parent_id === parentId).map(cat => ({
      ...cat,
      children: this.buildTree(categories, cat.id),
    }));
  }

  /**
   * Busca categorías con filtros
   */
  async search(filters: CategoryFilters): Promise<Category[]> {
    let query = supabase.from(this.tableName).select('*');

    if (filters.level !== undefined) {
      query = query.eq('level', filters.level);
    }

    if (filters.parentId !== undefined) {
      query = query.eq('parent_id', filters.parentId);
    }

    // Temporalmente remover filtro is_active hasta que la columna exista
    // if (filters.isActive !== undefined) {
    //   query = query.eq('is_active', filters.isActive);
    // }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const trimmedQuery = filters.searchQuery.trim();
      // Temporalmente remover búsqueda por description hasta que la columna exista
      query = query.or(`name.ilike.%${trimmedQuery}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });
    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Actualiza orden de una categoría
   * Nota: sort_order no existe en la DB actual, método temporalmente deshabilitado
   */
  async updateSortOrder(categoryId: string, sortOrder: number): Promise<Category> {
    // Temporalmente retorna la categoría sin modificar hasta que sort_order exista en DB
    const category = await this.findById(categoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    return category;
  }

  /**
   * Activa o desactiva una categoría
   * Nota: is_active no existe en la DB actual, método temporalmente deshabilitado
   */
  async toggleActive(categoryId: string, isActive: boolean): Promise<Category> {
    // Temporalmente retorna la categoría sin modificar hasta que is_active exista en DB
    const category = await this.findById(categoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    return category;
  }

  /**
   * Cuenta productos en una categoría
   */
  async countProducts(categoryId: string): Promise<number> {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('is_deleted', false);

    if (error) this.handleError(error);
    return count || 0;
  }

  /**
   * Verifica si una categoría tiene hijos
   */
  async hasChildren(categoryId: string): Promise<boolean> {
    const count = await this.count({ parent_id: categoryId });
    return count > 0;
  }
}

export const categoryRepository = new CategoryRepository();
