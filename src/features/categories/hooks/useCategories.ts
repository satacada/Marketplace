/**
 * ============================================================================
 * FILE: useCategories.ts
 * ============================================================================
 * 
 * @description Hook personalizado para gestionar categorías.
 *              Proporciona estado y operaciones de categorías.
 * 
 * @module Features/Categories/Hooks
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react (useState, useEffect, useCallback)
 * - @/features/categories/services/category.service
 * - @/features/categories/types/category.types.ts
 * 
 * @related-files
 * - @/features/categories/services/category.service.ts
 * - @/features/categories/types/category.types.ts
 * 
 * @exports
 * - useCategories (hook)
 * 
 * @example
 * ```tsx
 * const { categories, loading, createCategory, deleteCategory } = useCategories();
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { categoryService } from '../services/category.service';
import { Category, CreateCategoryInput, UpdateCategoryInput, CategoryFilters } from '../types/category.types';

export function useCategories(filters?: CategoryFilters) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar filters para evitar re-renders infinitos
  const memoizedFilters = useMemo(() => filters, [
    filters?.level,
    filters?.parentId,
    filters?.searchQuery,
    filters?.isActive,
  ]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (memoizedFilters?.level !== undefined) {
        // Categorías por nivel
        const data = await categoryService.getCategoriesByLevel(memoizedFilters.level);
        setCategories(data);
      } else if (memoizedFilters?.parentId !== undefined) {
        // Categorías hijas
        const data = await categoryService.getChildCategories(memoizedFilters.parentId);
        setCategories(data);
      } else if (memoizedFilters?.searchQuery || memoizedFilters?.isActive !== undefined) {
        // Búsqueda con filtros
        const data = await categoryService.searchCategories(memoizedFilters || {});
        setCategories(data);
      } else {
        // Categorías raíz por defecto
        const data = await categoryService.getRootCategories();
        setCategories(data);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Error al cargar categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  /**
   * Obtiene árbol completo de categorías
   */
  const getCategoryTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tree = await categoryService.getCategoryTree();
      setCategories(tree);
    } catch (err: any) {
      setError(err.message || 'Error al cargar árbol de categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea una nueva categoría
   */
  const createCategory = useCallback(async (input: CreateCategoryInput) => {
    try {
      setError(null);
      const newCategory = await categoryService.createCategory(input);
      setCategories(prev => [...prev, newCategory]);
      return { success: true, category: newCategory };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualiza una categoría
   */
  const updateCategory = useCallback(async (categoryId: string, input: UpdateCategoryInput) => {
    try {
      setError(null);
      const updatedCategory = await categoryService.updateCategory(categoryId, input);
      setCategories(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      return { success: true, category: updatedCategory };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Elimina una categoría
   */
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      setError(null);
      await categoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Activa/desactiva una categoría
   */
  const toggleCategoryActive = useCallback(async (categoryId: string) => {
    try {
      setError(null);
      const updatedCategory = await categoryService.toggleCategoryActive(categoryId);
      setCategories(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      return { success: true, category: updatedCategory };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cambiar estado de categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualiza orden de categorías
   */
  const updateCategoryOrder = useCallback(async (categoryId: string, sortOrder: number) => {
    try {
      setError(null);
      const updatedCategory = await categoryService.updateCategoryOrder(categoryId, sortOrder);
      setCategories(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      return { success: true, category: updatedCategory };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar orden';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    getCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    updateCategoryOrder,
  };
}
