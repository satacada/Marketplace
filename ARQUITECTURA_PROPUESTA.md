# PROPUESTA DE ARQUITECTURA MODERNA - Marketplace SaaS

## 📋 RESUMEN EJECUTIVO

Esta propuesta transforma el código monolítico actual en una arquitectura **Clean Architecture** escalable, mantenible y documentada que permita a cualquier desarrollador nuevo ubicarse rápidamente.

---

## 🎯 OBJETIVOS

1. **Separación de responsabilidades**: Cada capa tiene una función específica
2. **Documentación estandarizada**: Cada archivo tiene cabecera con información clave
3. **CRUD centralizado**: Patrón Repository para operaciones de base de datos
4. **Reutilización**: Servicios, hooks y utilidades compartidas
5. **Escalabilidad**: Estructura preparada para crecimiento
6. **Mantenibilidad**: Código fácil de entender y modificar

---

## 🏗️ ARQUITECTURA PROPUESTA (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (Components, Pages, Hooks - Solo UI y estado local)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  (Services, Use Cases - Lógica de negocio)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│  (Types, Interfaces, Constants - Modelo del dominio)        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                      │
│  (Repositories, API Clients - Acceso a datos externos)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE CARPETAS PROPUESTA

```
src/
├── app/                          # Next.js App Router (Solo routing y layouts)
│   ├── (auth)/                   # Grupo de rutas auth
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Grupo de rutas dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── questions/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── (marketplace)/            # Grupo de rutas marketplace
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── ask/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # Componentes UI reutilizables
│   ├── ui/                       # Componentes base (botones, inputs, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Select.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── LayoutWrapper.tsx
│   ├── marketplace/              # Componentes específicos del marketplace
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── SearchBar.tsx
│   │   └── CategoryFilter.tsx
│   └── dashboard/                # Componentes específicos del dashboard
│       ├── ProductForm.tsx
│       ├── ProductList.tsx
│       └── OrderCard.tsx
│
├── features/                     # Feature-based organization
│   ├── auth/                     # Feature: Autenticación
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── products/                 # Feature: Productos
│   │   ├── services/
│   │   │   └── product.service.ts
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   └── useProductForm.ts
│   │   └── types/
│   │       └── product.types.ts
│   ├── cart/                     # Feature: Carrito
│   │   ├── services/
│   │   │   └── cart.service.ts
│   │   ├── hooks/
│   │   │   └── useCart.ts
│   │   └── types/
│   │       └── cart.types.ts
│   ├── orders/                   # Feature: Pedidos
│   │   ├── services/
│   │   │   └── order.service.ts
│   │   ├── hooks/
│   │   │   └── useOrders.ts
│   │   └── types/
│   │       └── order.types.ts
│   └── categories/               # Feature: Categorías
│       ├── services/
│       │   └── category.service.ts
│       ├── hooks/
│       │   └── useCategories.ts
│       └── types/
│           └── category.types.ts
│
├── infrastructure/               # Capa de infraestructura
│   ├── repositories/             # Repositories (CRUD centralizado)
│   │   ├── base.repository.ts
│   │   ├── product.repository.ts
│   │   ├── user.repository.ts
│   │   ├── cart.repository.ts
│   │   ├── order.repository.ts
│   │   └── category.repository.ts
│   ├── database/                 # Configuración de base de datos
│   │   ├── supabase.client.ts
│   │   └── supabase.config.ts
│   └── storage/                  # Configuración de storage
│       └── image.storage.ts
│
├── shared/                       # Código compartido entre features
│   ├── types/                    # Types globales
│   │   ├── common.types.ts
│   │   └── api.types.ts
│   ├── constants/                # Constantes globales
│   │   ├── app.constants.ts
│   │   ├── api.constants.ts
│   │   └── validation.constants.ts
│   ├── utils/                    # Utilidades generales
│   │   ├── format.utils.ts
│   │   ├── validation.utils.ts
│   │   ├── date.utils.ts
│   │   └── string.utils.ts
│   ├── hooks/                    # Hooks globales
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   └── validators/               # Validadores
│       ├── auth.validator.ts
│       ├── product.validator.ts
│       └── order.validator.ts
│
├── lib/                          # Librerías de terceros y configuración
│   ├── i18n/                     # Internacionalización
│   │   ├── errors.ts
│   │   └── locales.ts
│   └── config/                   # Configuración de la app
│       └── app.config.ts
│
└── styles/                       # Estilos globales
    └── globals.css
```

---

## 📝 SISTEMA DE DOCUMENTACIÓN DE ARCHIVOS

### Plantilla de Cabecera Estándar

Cada archivo debe tener esta cabecera al inicio:

```typescript
/**
 * ============================================================================
 * FILE: ProductCard.tsx
 * ============================================================================
 * 
 * @description Componente de tarjeta de producto para el marketplace.
 *              Muestra información del producto con galería de imágenes
 *              y botones de acción.
 * 
 * @module Presentation/Components/Marketplace
 * 
 * @author [Nombre del autor]
 * @created [Fecha de creación]
 * @modified [Última modificación]
 * 
 * @dependencies
 * - React (useState, useEffect)
 * - next/image (Image)
 * - next/link (Link)
 * - @/features/products/hooks/useProducts
 * - @/components/ui/Card
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/features/products/types/product.types.ts
 * - @/components/marketplace/ProductGallery.tsx
 * 
 * @exports
 * - ProductCard (default)
 * 
 * @example
 * ```tsx
 * <ProductCard 
 *   product={productData}
 *   onAddToCart={handleAddToCart}
 *   isOwnProduct={false}
 * />
 * ```
 * 
 * ============================================================================
 */
```

### Tipos de Documentación por Capa

**1. Presentation Layer (Components/Pages):**
- Descripción del componente/página
- Props que recibe
- Eventos que emite
- Dependencias de UI
- Ejemplo de uso

**2. Application Layer (Services):**
- Descripción del servicio
- Casos de uso que implementa
- Métodos públicos
- Dependencias de otros servicios
- Manejo de errores

**3. Domain Layer (Types):**
- Descripción del tipo/interfaz
- Propiedades y sus tipos
- Validaciones aplicadas
- Relaciones con otros tipos

**4. Infrastructure Layer (Repositories):**
- Descripción del repositorio
- Tablas de base de datos que maneja
- Operaciones CRUD disponibles
- Políticas de RLS aplicadas

---

## 🔧 PATRÓN REPOSITORY (CRUD CENTRALIZADO)

### Base Repository

```typescript
/**
 * ============================================================================
 * FILE: base.repository.ts
 * ============================================================================
 * 
 * @description Repositorio base con operaciones CRUD genéricas.
 *              Todos los repositories específicos extienden de este.
 * 
 * @module Infrastructure/Repositories
 * 
 * @dependencies
 * - @/infrastructure/database/supabase.client
 * 
 * @exports
 * - BaseRepository (class)
 * 
 * ============================================================================
 */

import { supabase } from '@/infrastructure/database/supabase.client';

export class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Obtiene todos los registros
   */
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Obtiene un registro por ID
   */
  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Crea un nuevo registro
   */
  async create(data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Actualiza un registro
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  /**
   * Soft delete (marca como eliminado)
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Hard delete (elimina permanentemente)
   */
  async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
```

### Product Repository (Ejemplo)

```typescript
/**
 * ============================================================================
 * FILE: product.repository.ts
 * ============================================================================
 * 
 * @description Repositorio para operaciones de productos en Supabase.
 *              Maneja CRUD de productos con relaciones y filtros.
 * 
 * @module Infrastructure/Repositories
 * 
 * @dependencies
 * - @/infrastructure/repositories/base.repository
 * - @/infrastructure/database/supabase.client
 * 
 * @related-files
 * - @/features/products/types/product.types.ts
 * - @/features/products/services/product.service.ts
 * 
 * @exports
 * - ProductRepository (class)
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
   * Obtiene productos de un vendedor específico
   */
  async findBySeller(sellerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, categories(name), profiles(store_name)')
      .eq('seller_id', sellerId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Busca productos con filtros avanzados
   */
  async search(filters: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from(this.tableName)
      .select('*, categories(name), profiles(store_name)')
      .eq('is_deleted', false)
      .gt('stock', 0);

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    if (filters.sellerId) {
      query = query.eq('seller_id', filters.sellerId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  /**
   * Actualiza stock de un producto
   */
  async updateStock(productId: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ stock: quantity })
      .eq('id', productId);

    if (error) throw error;
  }
}

export const productRepository = new ProductRepository();
```

---

## 🎨 NOMENCLATURA ESTÁNDAR

### Archivos

**Componentes:**
- PascalCase: `ProductCard.tsx`, `SearchBar.tsx`, `Modal.tsx`
- Sufijo para tipo: `*.component.tsx`, `*.page.tsx`, `*.layout.tsx`

**Services:**
- camelCase con sufijo: `product.service.ts`, `auth.service.ts`, `cart.service.ts`

**Repositories:**
- camelCase con sufijo: `product.repository.ts`, `user.repository.ts`

**Hooks:**
- camelCase con prefijo: `useProducts.ts`, `useAuth.ts`, `useCart.ts`

**Types:**
- camelCase con sufijo: `product.types.ts`, `auth.types.ts`, `common.types.ts`

**Utils:**
- camelCase con sufijo: `format.utils.ts`, `validation.utils.ts`

**Constants:**
- camelCase con sufijo: `app.constants.ts`, `api.constants.ts`

### Variables y Funciones

**Variables:**
- camelCase: `userName`, `productList`, `isLoading`

**Constantes:**
- UPPER_SNAKE_CASE: `MAX_IMAGE_COUNT`, `DEFAULT_PAGE_SIZE`

**Funciones:**
- camelCase con verbo: `getUserById()`, `createProduct()`, `handleDelete()`

**Interfaces/Types:**
- PascalCase: `Product`, `User`, `CartItem`

**Enums:**
- PascalCase: `UserRole`, `OrderStatus`, `ProductStatus`

---

## 🔌 SERVICIOS (LÓGICA DE NEGOCIO)

### Product Service (Ejemplo)

```typescript
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
 * @dependencies
 * - @/infrastructure/repositories/product.repository
 * - @/infrastructure/storage/image.storage
 * - @/shared/utils/format.utils
 * 
 * @related-files
 * - @/features/products/types/product.types.ts
 * - @/features/products/hooks/useProducts.ts
 * 
 * @exports
 * - productService (object)
 * 
 * ============================================================================
 */

import { productRepository } from '@/infrastructure/repositories/product.repository';
import { uploadProductImages } from '@/infrastructure/storage/image.storage';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product.types';

export const productService = {
  /**
   * Crea un nuevo producto con validaciones
   */
  async createProduct(input: CreateProductInput, userId: string): Promise<Product> {
    // Validaciones de negocio
    if (!input.title || input.title.length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }

    if (input.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (input.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Subir imágenes si existen
    let imageUrls: string[] = [];
    if (input.images && input.images.length > 0) {
      imageUrls = await uploadProductImages(input.images, userId);
    }

    // Crear producto en base de datos
    const productData = {
      seller_id: userId,
      title: input.title,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.categoryId,
      image_urls: imageUrls,
      status: 'pending',
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

    // Actualizar imágenes si se proporcionan
    let imageUrls = existingProduct.image_urls;
    if (input.images) {
      imageUrls = await uploadProductImages(input.images, userId);
    }

    const updateData = {
      ...input,
      image_urls: imageUrls,
    };

    return await productRepository.update(productId, updateData);
  },

  /**
   * Obtiene productos del marketplace con filtros
   */
  async getMarketplaceProducts(filters: ProductFilters): Promise<Product[]> {
    return await productRepository.search(filters);
  },

  /**
   * Obtiene productos del vendedor
   */
  async getSellerProducts(sellerId: string): Promise<Product[]> {
    return await productRepository.findBySeller(sellerId);
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
};
```

---

## 🪝 HOOKS PERSONALIZADOS

### useProducts (Ejemplo)

```typescript
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
 * @dependencies
 * - react (useState, useEffect, useCallback)
 * - @/features/products/services/product.service
 * - @/features/products/types/product.types.ts
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/components/marketplace/ProductCard.tsx
 * 
 * @exports
 * - useProducts (hook)
 * 
 * @example
 * ```tsx
 * const { products, loading, error, refresh } = useProducts({
 *   categoryId: '123',
 *   searchQuery: 'laptop'
 * });
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/product.service';
import { Product, ProductFilters } from '../types/product.types';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getMarketplaceProducts(filters || {});
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
  };
}
```

---

## 🔄 MIGRACIÓN GRADUAL

### Fase 1: Infraestructura (Semana 1)
1. Crear estructura de carpetas
2. Implementar BaseRepository
3. Crear repositories específicos
4. Configurar tipos compartidos

### Fase 2: Services y Hooks (Semana 2)
1. Crear servicios para cada feature
2. Implementar hooks personalizados
3. Migrar lógica de negocio a services

### Fase 3: Componentes (Semana 3)
1. Refactorizar componentes para usar hooks
2. Separar componentes UI de lógica
3. Crear componentes reutilizables en /components/ui

### Fase 4: Pages (Semana 4)
1. Refactorizar pages para usar services/hooks
2. Eliminar lógica de negocio de pages
3. Agregar documentación a todos los archivos

---

## 📊 BENEFICIOS ESPERADOS

### Para Desarrolladores Nuevos
- **Onboarding rápido**: Estructura predecible y documentada
- **Fácil localización**: Nomenclatura consistente y carpetas lógicas
- **Menos curva de aprendizaje**: Patrones estándar en todo el proyecto

### Para Mantenimiento
- **Menos bugs**: Separación de responsabilidades reduce errores
- **Fácil debugging**: Cada capa tiene responsabilidad clara
- **Testing más simple**: Services y repositories se pueden testear independientemente

### Para Escalabilidad
- **Fácil agregar features**: Estructura preparada para crecimiento
- **Reutilización**: Componentes y servicios compartidos
- **Performance**: Optimizaciones por capa independientes

---

## ❓ PREGUNTAS PARA DISCUSIÓN

1. **¿Estás de acuerdo con la estructura de carpetas propuesta?**
2. **¿Prefieres otro patrón de arquitectura (Hexagonal, Onion, etc.)?**
3. **¿La nomenclatura propuesta se adapta a tu estilo?**
4. **¿Quieres agregar alguna capa o módulo adicional?**
5. **¿El timeline de migración de 4 semanas es realista?**
6. **¿Hay alguna preferencia sobre herramientas de testing?**
7. **¿Quieres mantener compatibilidad con el código actual durante la migración?**

---

## 📚 REFERENCIAS

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js Best Practices](https://nextjs.org/docs)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
