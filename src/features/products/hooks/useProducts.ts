/**
 * ============================================================================
 * FILE: useProducts.ts
 * ============================================================================
 * 
 * @description Hook personalizado para gestionar productos.
 *              Proporciona estado y operaciones de productos.
 * 
 * @module Features/Products/Hooks
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react (useState, useEffect, useCallback)
 * - @/features/products/services/product.service
 * - @/features/products/types/product.types.ts
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/features/products/types/product.types.ts
 * 
 * @exports
 * - useProducts (hook)
 * 
 * @example
 * ```tsx
 * const { products, loading, error, refresh, createProduct } = useProducts({
 *   categoryId: '123',
 *   searchQuery: 'laptop'
 * });
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/product.service';
import { Product, ProductFilters, CreateProductInput, UpdateProductInput } from '../types/product.types';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar filters para evitar re-renders infinitos
  const memoizedFilters = useMemo(() => filters, [
    filters?.sellerId,
    filters?.categoryId,
    filters?.searchQuery,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.includeFavoriteCount,
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (memoizedFilters?.sellerId) {
        // Productos de un vendedor
        const data = await productService.getSellerProducts(
          memoizedFilters.sellerId, 
          memoizedFilters.includeFavoriteCount
        );
        setProducts(data);
      } else if (memoizedFilters?.categoryId) {
        // Productos por categoría
        const data = await productService.getProductsByCategory(memoizedFilters.categoryId);
        setProducts(data);
      } else {
        // Productos del marketplace
        const data = await productService.getMarketplaceProducts(memoizedFilters || {});
        setProducts(data);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  /**
   * Crea un nuevo producto
   */
  const createProduct = useCallback(async (input: CreateProductInput, userId: string) => {
    try {
      setError(null);
      const newProduct = await productService.createProduct(input, userId);
      setProducts(prev => [newProduct, ...prev]);
      return { success: true, product: newProduct };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear producto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualiza un producto
   */
  const updateProduct = useCallback(async (productId: string, input: UpdateProductInput, userId: string) => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(productId, input, userId);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return { success: true, product: updatedProduct };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar producto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Elimina un producto
   */
  const deleteProduct = useCallback(async (productId: string, userId: string) => {
    try {
      setError(null);
      await productService.deleteProduct(productId, userId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar producto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualiza stock de un producto
   */
  const updateStock = useCallback(async (productId: string, quantity: number, userId: string) => {
    try {
      setError(null);
      const updatedProduct = await productService.updateStock(productId, quantity, userId);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return { success: true, product: updatedProduct };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar stock';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Activa/desactiva stock de un producto
   */
  const toggleStock = useCallback(async (productId: string, userId: string) => {
    try {
      setError(null);
      const updatedProduct = await productService.toggleStock(productId, userId);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return { success: true, product: updatedProduct };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cambiar stock';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    toggleStock,
  };
}
