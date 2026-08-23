/**
 * ============================================================================
 * FILE: category.service.ts
 * ============================================================================
 * 
 * @description Servicio de categorías que coordina operaciones de negocio.
 *              Valida reglas de negocio y coordina con repositorios.
 * 
 * @module Features/Categories/Services
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/category.repository
 * - @/features/categories/types/category.types.ts
 * - @/shared/constants/validation.constants.ts
 * 
 * @related-files
 * - @/features/categories/hooks/useCategories.ts
 * - @/features/categories/types/category.types.ts
 * 
 * @exports
 * - categoryService (object)
 * 
 * ============================================================================
 */

import { categoryRepository } from '@/infrastructure/repositories/category.repository';
import { Category, CreateCategoryInput, UpdateCategoryInput, CategoryFilters } from '../types/category.types';
import { VALIDATION_RULES } from '@/shared/constants/validation.constants';

export const categoryService = {
  /**
   * Crea una nueva categoría con validaciones
   */
  async createCategory(input: CreateCategoryInput): Promise<Category> {
    // Validaciones de negocio
    if (!input.name || input.name.length < VALIDATION_RULES.PRODUCT_NAME_MIN_LENGTH) {
      throw new Error(`El nombre debe tener al menos ${VALIDATION_RULES.PRODUCT_NAME_MIN_LENGTH} caracteres`);
    }

    if (input.name.length > VALIDATION_RULES.PRODUCT_NAME_MAX_LENGTH) {
      throw new Error(`El nombre no puede exceder ${VALIDATION_RULES.PRODUCT_NAME_MAX_LENGTH} caracteres`);
    }

    if (input.level < 1) {
      throw new Error('El nivel debe ser al menos 1');
    }

    // Si tiene padre, verificar que existe
    if (input.parentId) {
      const parent = await categoryRepository.findById(input.parentId);
      if (!parent) {
        throw new Error('Categoría padre no encontrada');
      }

      // Verificar que el nivel sea correcto
      if (input.level !== parent.level + 1) {
        throw new Error('El nivel debe ser uno más que el padre');
      }
    } else if (input.level !== 1) {
      throw new Error('Las categorías raíz deben tener nivel 1');
    }

    const categoryData: any = {
      name: input.name,
      parent_id: input.parentId || undefined,
      level: input.level,
    };

    // Temporalmente no incluir description, is_active, sort_order hasta que existan en DB
    // if (input.description) {
    //   categoryData.description = input.description;
    // }
    // categoryData.is_active = true;
    // categoryData.sort_order = input.sortOrder || 0;

    return await categoryRepository.create(categoryData);
  },

  /**
   * Actualiza una categoría existente
   */
  async updateCategory(categoryId: string, input: UpdateCategoryInput): Promise<Category> {
    const existing = await categoryRepository.findById(categoryId);
    
    if (!existing) {
      throw new Error('Categoría no encontrada');
    }

    // Validaciones
    if (input.name !== undefined) {
      if (input.name.length < VALIDATION_RULES.PRODUCT_NAME_MIN_LENGTH) {
        throw new Error(`El nombre debe tener al menos ${VALIDATION_RULES.PRODUCT_NAME_MIN_LENGTH} caracteres`);
      }
      if (input.name.length > VALIDATION_RULES.PRODUCT_NAME_MAX_LENGTH) {
        throw new Error(`El nombre no puede exceder ${VALIDATION_RULES.PRODUCT_NAME_MAX_LENGTH} caracteres`);
      }
    }

    if (input.parentId !== undefined) {
      if (input.parentId === categoryId) {
        throw new Error('Una categoría no puede ser su propio padre');
      }

      if (input.parentId) {
        const parent = await categoryRepository.findById(input.parentId);
        if (!parent) {
          throw new Error('Categoría padre no encontrada');
        }
      }
    }

    return await categoryRepository.update(categoryId, input);
  },

  /**
   * Obtiene categorías por nivel
   */
  async getCategoriesByLevel(level: number): Promise<Category[]> {
    return await categoryRepository.findByLevel(level);
  },

  /**
   * Obtiene categorías raíz (nivel 1)
   */
  async getRootCategories(): Promise<Category[]> {
    return await categoryRepository.findRootCategories();
  },

  /**
   * Obtiene categorías hijas de un padre
   */
  async getChildCategories(parentId: string): Promise<Category[]> {
    return await categoryRepository.findByParent(parentId);
  },

  /**
   * Obtiene árbol completo de categorías
   */
  async getCategoryTree(): Promise<Category[]> {
    return await categoryRepository.getCategoryTree();
  },

  /**
   * Busca categorías con filtros
   */
  async searchCategories(filters: CategoryFilters): Promise<Category[]> {
    return await categoryRepository.search(filters);
  },

  /**
   * Elimina una categoría (soft delete)
   */
  async deleteCategory(categoryId: string): Promise<void> {
    // Verificar si tiene hijos
    const hasChildren = await categoryRepository.hasChildren(categoryId);
    if (hasChildren) {
      throw new Error('No se puede eliminar una categoría con subcategorías');
    }

    // Verificar si tiene productos
    const productCount = await categoryRepository.countProducts(categoryId);
    if (productCount > 0) {
      throw new Error('No se puede eliminar una categoría con productos');
    }

    await categoryRepository.softDelete(categoryId);
  },

  /**
   * Activa o desactiva una categoría
   */
  async toggleCategoryActive(categoryId: string): Promise<Category> {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    return await categoryRepository.toggleActive(categoryId, !category.is_active);
  },

  /**
   * Actualiza orden de categorías
   */
  async updateCategoryOrder(categoryId: string, sortOrder: number): Promise<Category> {
    return await categoryRepository.updateSortOrder(categoryId, sortOrder);
  },

  /**
   * Obtiene una categoría por ID
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    return await categoryRepository.findById(categoryId);
  },
};
