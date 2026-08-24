/**
 * ============================================================================
 * FILE: product.service.ts
 * ============================================================================
 * 
 * @description Servicio de productos que coordina operaciones de negocio.
 *              Valida reglas de negocio y coordina con repositorios.
 * 
 * @module Features/Products/Services
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/infrastructure/repositories/product.repository
 * - @/infrastructure/storage/image.storage
 * - @/features/products/types/product.types.ts
 * - @/shared/constants/app.constants.ts
 * - @/shared/constants/validation.constants.ts
 * 
 * @related-files
 * - @/features/products/hooks/useProducts.ts
 * - @/features/products/types/product.types.ts
 * 
 * @exports
 * - productService (object)
 * 
 * ============================================================================
 */

import { productRepository } from '@/infrastructure/repositories/product.repository';
import { supabase } from '@/infrastructure/database/supabase.client';
import { Product, CreateProductInput, UpdateProductInput, ProductFilters } from '../types/product.types';
import { AdvancedProductFilters, SortOption } from '../types/product-filters.types';
import { IMAGE_CONFIG, PRODUCT_STATUS } from '@/shared/constants/app.constants';
import { VALIDATION_RULES } from '@/shared/constants/validation.constants';

export const productService = {
  /**
   * Crea un nuevo producto con validaciones
   */
  async createProduct(input: CreateProductInput, userId: string): Promise<Product> {
    // Validaciones de negocio
    if (!input.title || input.title.length < VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH) {
      throw new Error(`El título debe tener al menos ${VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH} caracteres`);
    }

    if (input.title.length > VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH) {
      throw new Error(`El título no puede exceder ${VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH} caracteres`);
    }

    if (!input.description || input.description.length < VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN_LENGTH) {
      throw new Error(`La descripción debe tener al menos ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN_LENGTH} caracteres`);
    }

    if (input.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (input.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Validar imágenes
    if (input.images && input.images.length > IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT) {
      throw new Error(`Máximo ${IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT} imágenes permitidas`);
    }

    // Subir imágenes si existen
    let imageUrls: string[] = [];
    if (input.images && input.images.length > 0) {
      imageUrls = await this.uploadProductImages(input.images, userId);
    }

    // Crear producto en base de datos
    const productData = {
      seller_id: userId,
      title: input.title,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.categoryId || null,
      image_urls: imageUrls,
      status: PRODUCT_STATUS.PENDING,
      is_deleted: false,
    };

    return await productRepository.create(productData);
  },

  /**
   * Actualiza un producto existente
   */
  async updateProduct(productId: string, input: UpdateProductInput, userId: string): Promise<Product> {
    // Verificar que el producto pertenece al usuario
    const existingProduct = await productRepository.findById(productId);
    if (!existingProduct || existingProduct.seller_id !== userId) {
      throw new Error('No tienes permiso para editar este producto');
    }

    // Validaciones
    if (input.title !== undefined) {
      if (input.title.length < VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH) {
        throw new Error(`El título debe tener al menos ${VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH} caracteres`);
      }
      if (input.title.length > VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH) {
        throw new Error(`El título no puede exceder ${VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH} caracteres`);
      }
    }

    if (input.price !== undefined && input.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (input.stock !== undefined && input.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Actualizar imágenes si se proporcionan
    let imageUrls = existingProduct.image_urls;
    if (input.images) {
      if (input.images.length > IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT) {
        throw new Error(`Máximo ${IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT} imágenes permitidas`);
      }
      imageUrls = await this.uploadProductImages(input.images, userId);
    }

    const updateData: Partial<Product> = {
      ...input,
      image_urls: imageUrls,
    };

    return await productRepository.update(productId, updateData);
  },

  /**
   * Obtiene productos del marketplace con filtros
   */
  async getMarketplaceProducts(filters: ProductFilters): Promise<Product[]> {
    const marketplaceFilters: ProductFilters = {
      ...filters,
      status: PRODUCT_STATUS.APPROVED,
      inStock: true,
    };
    return await productRepository.search(marketplaceFilters);
  },

  /**
   * Obtiene productos del vendedor
   */
  async getSellerProducts(sellerId: string, includeFavoriteCount: boolean = false): Promise<Product[]> {
    return await productRepository.findBySeller(sellerId, includeFavoriteCount);
  },

  /**
   * Obtiene un producto por ID con relaciones
   */
  async getProductById(productId: string): Promise<Product | null> {
    return await productRepository.findByIdWithRelations(productId);
  },

  /**
   * Elimina un producto (soft delete)
   */
  async deleteProduct(productId: string, userId: string): Promise<void> {
    const product = await productRepository.findById(productId);
    if (!product || product.seller_id !== userId) {
      throw new Error('No tienes permiso para eliminar este producto');
    }

    await productRepository.softDelete(productId);
  },

  /**
   * Actualiza stock de un producto
   */
  async updateStock(productId: string, quantity: number, userId: string): Promise<Product> {
    const product = await productRepository.findById(productId);
    if (!product || product.seller_id !== userId) {
      throw new Error('No tienes permiso para actualizar este producto');
    }

    if (quantity < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return await productRepository.updateStock(productId, quantity);
  },

  /**
   * Activa/desactiva stock de un producto
   */
  async toggleStock(productId: string, userId: string): Promise<Product> {
    const product = await productRepository.findById(productId);
    if (!product || product.seller_id !== userId) {
      throw new Error('No tienes permiso para actualizar este producto');
    }

    const newStock = product.stock > 0 ? 0 : 10;
    return await productRepository.updateStock(productId, newStock);
  },

  /**
   * Sube imágenes de producto a Supabase Storage
   */
  async uploadProductImages(images: File[], userId: string): Promise<string[]> {
    const imageUrls: string[] = [];

    for (const image of images) {
      // Validar tamaño
      if (image.size > IMAGE_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(`La imagen ${image.name} excede el tamaño máximo de ${IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB`);
      }

      // Validar formato
      if (!IMAGE_CONFIG.ALLOWED_FORMATS.includes(image.type as any)) {
        throw new Error(`Formato no permitido para ${image.name}`);
      }

      // Generar nombre único
      const fileExt = image.name.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (error) {
        throw new Error(`Error al subir ${image.name}: ${error.message}`);
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    return imageUrls;
  },

  /**
   * Obtiene productos por categoría
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await productRepository.findByCategory(categoryId);
  },

  /**
   * Cuenta productos de un vendedor
   */
  async countSellerProducts(sellerId: string): Promise<number> {
    return await productRepository.countBySeller(sellerId);
  },

  /**
   * Obtiene productos con filtros avanzados
   */
  async getAdvancedProducts(filters: AdvancedProductFilters): Promise<{ products: Product[]; total: number }> {
    let query = supabase
      .from('products')
      .select('*, categories(name), profiles(store_name)', { count: 'exact' })
      .eq('is_deleted', false);
      // Temporalmente remover filtro de status para mostrar todos los productos activos
      // .eq('status', 'approved');

    // Filtro por búsqueda
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    // Filtro por categoría
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    // Filtro por rango de precio
    if (filters.priceRange) {
      query = query.gte('price', filters.priceRange.min);
      if (filters.priceRange.max > 0) {
        query = query.lte('price', filters.priceRange.max);
      }
    }

    // Filtro por envío gratis
    if (filters.hasFreeShipping) {
      query = query.eq('has_free_shipping', true);
    }

    // Ordenamiento
    const sortColumn = this.getSortColumn(filters.sortBy || 'relevance');
    const ascending = filters.sortBy === 'price_asc';
    query = query.order(sortColumn, { ascending });

    // Paginación
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      products: data || [],
      total: count || 0
    };
  },

  /**
   * Obtiene productos para autocompletado de búsqueda
   */
  async searchSuggestions(query: string, limit: number = 5): Promise<Array<{ id: string; title: string; image_urls: string[] | null }>> {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase
      .from('products')
      .select('id, title, image_urls')
      .eq('is_deleted', false)
      .eq('status', 'approved')
      .ilike('title', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtiene el nombre de la columna para ordenamiento
   */
  getSortColumn(sortBy: SortOption): string {
    switch (sortBy) {
      case 'price_asc':
      case 'price_desc':
        return 'price';
      case 'rating_desc':
        return 'average_rating';
      case 'newest':
        return 'created_at';
      case 'relevance':
      default:
        return 'created_at';
    }
  }
};
