/**
 * ============================================================================
 * FILE: product.repository.ts
 * ============================================================================
 * 
 * @description Repositorio para operaciones de productos en Supabase.
 *              Maneja CRUD de productos con relaciones y filtros avanzados.
 * 
 * @module Infrastructure/Repositories
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/base.repository
 * - @/infrastructure/database/supabase.client
 * - @/features/products/types/product.types.ts
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/features/products/types/product.types.ts
 * 
 * @exports
 * - ProductRepository (class)
 * - productRepository (instance)
 * 
 * ============================================================================
 */

import { BaseRepository } from './base.repository';
import { supabase } from '@/infrastructure/database/supabase.client';
import { Product, ProductFilters } from '@/features/products/types/product.types';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
  }

  /**
   * Obtiene productos de un vendedor específico con relaciones
   */
  async findBySeller(sellerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, categories(name), profiles(store_name)')
      .eq('seller_id', sellerId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Busca productos con filtros avanzados
   */
  async search(filters: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from(this.tableName)
      .select('*, categories(name), profiles(store_name)')
      .eq('is_deleted', false);

    // Filtro de stock
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        query = query.gt('stock', 0);
      } else {
        query = query.eq('stock', 0);
      }
    }

    // Filtro de categoría
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    // Filtro de vendedor
    if (filters.sellerId) {
      query = query.eq('seller_id', filters.sellerId);
    }

    // Filtro de estado
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Filtro de precio
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    // Búsqueda de texto
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const trimmedQuery = filters.searchQuery.trim();
      query = query.or(`title.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Obtiene un producto por ID con relaciones
   */
  async findByIdWithRelations(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, categories(*), profiles(store_name, email)')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      this.handleError(error);
    }
    return data;
  }

  /**
   * Actualiza stock de un producto
   */
  async updateStock(productId: string, quantity: number): Promise<Product> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ stock: quantity })
      .eq('id', productId)
      .select()
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Actualiza estado de un producto
   */
  async updateStatus(productId: string, status: string): Promise<Product> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status })
      .eq('id', productId)
      .select()
      .single();

    if (error) this.handleError(error);
    return data;
  }

  /**
   * Obtiene productos por categoría
   */
  async findByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, categories(name), profiles(store_name)')
      .eq('category_id', categoryId)
      .eq('is_deleted', false)
      .eq('status', 'approved')
      .gt('stock', 0)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error);
    return data || [];
  }

  /**
   * Cuenta productos por vendedor
   */
  async countBySeller(sellerId: string): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', sellerId)
      .eq('is_deleted', false);

    if (error) this.handleError(error);
    return count || 0;
  }
}

export const productRepository = new ProductRepository();
