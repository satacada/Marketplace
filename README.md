# Marketplace SaaS

Marketplace Multi-Tenant construido con Next.js, Supabase y Clean Architecture.

## 🏗️ Arquitectura

Este proyecto sigue una **Clean Architecture** con separación clara de responsabilidades:

```
src/
├── infrastructure/       # Capa de datos (repositorios, DB)
│   ├── database/        # Configuración de Supabase
│   └── repositories/    # Repositorios base y específicos
├── features/            # Lógica de negocio por feature
│   ├── auth/           # Autenticación y perfiles
│   ├── products/       # Gestión de productos
│   ├── cart/           # Carrito de compras
│   ├── categories/     # Categorías jerárquicas
│   └── orders/         # Gestión de órdenes
├── shared/             # Utilidades compartidas
│   ├── types/          # Tipos TypeScript comunes
│   ├── validators/     # Validadores de datos
│   └── utils/          # Funciones utilitarias
├── components/         # Componentes UI
│   ├── ui/            # Componentes base (Button, Input, Modal, Card)
│   ├── layout/        # Layout (Header, Sidebar, LayoutWrapper)
│   └── marketplace/   # Componentes específicos del marketplace
└── app/               # Pages Next.js (usando hooks)
```

### Capas de la Arquitectura

**1. Infrastructure Layer (`infrastructure/`)**
- Repositorios para acceso a datos (BaseRepository, ProductRepository, etc.)
- Configuración de Supabase
- Implementación de CRUD genéricos

**2. Application Layer (`features/`)**
- Servicios de negocio (auth.service, product.service, etc.)
- Hooks React para lógica de UI componible (useAuth, useProducts, useCart)
- Tipos y validadores específicos de cada feature

**3. Shared Layer (`shared/`)**
- Tipos TypeScript comunes (BaseEntity, ApiResponse, etc.)
- Validadores reutilizables
- Utilidades generales

**4. Presentation Layer (`components/`, `app/`)**
- Componentes UI reutilizables
- Pages Next.js que consumen hooks
- Layouts y navegación

## 🚀 Getting Started

### Prerrequisitos
- Node.js 22+ (recomendado)
- npm, yarn, pnpm o bun
- Cuenta de Supabase con proyecto configurado

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de producción

```bash
npm run build
npm start
```

## 📁 Estructura de Carpetas

### Infrastructure (`src/infrastructure/`)
```typescript
// Repositorio base con CRUD genérico
export class BaseRepository<T> {
  async findAll(options?: QueryOptions): Promise<T[]>
  async findById(id: string): Promise<T | null>
  async create(data: Partial<T>): Promise<T>
  async update(id: string, data: Partial<T>): Promise<T>
  async delete(id: string): Promise<void>
  // ... más métodos
}

// Repositorio específico
export class ProductRepository extends BaseRepository<Product> {
  // Métodos específicos de productos
}
```

### Features (`src/features/`)
```typescript
// Servicio de negocio
export const productService = {
  async createProduct(input: CreateProductInput): Promise<Product>
  async updateProduct(id: string, input: UpdateProductInput): Promise<Product>
  async deleteProduct(id: string): Promise<void>
  // ... más métodos
}

// Hook React
export function useProducts(options?: ProductOptions) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Lógica de negocio y estado
  return { products, loading, refresh, ... }
}
```

### Components (`src/components/`)
```typescript
// Componente UI base
export function Button({ variant, size, isLoading, ...props }: ButtonProps) {
  // Componente reutilizable con variantes
}

// Componente de layout
export function Header({ title, cartItemCount }: HeaderProps) {
  const { user, isAuthenticated } = useAuth()
  // Header con navegación contextual
}
```

## 🔑 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 🧪 Pruebas

El proyecto incluye pruebas de integración manuales a través del servidor de desarrollo. Todas las páginas principales han sido verificadas:

- ✅ Autenticación (login/registro)
- ✅ Marketplace (listado de productos)
- ✅ Dashboard de vendedor (gestión de productos)
- ✅ Carrito de compras
- ✅ Perfil de usuario
- ✅ Órdenes (compras y ventas)

## 📚 Documentación

Todos los archivos incluyen headers de documentación estándar:

```typescript
/**
 * ============================================================================
 * FILE: nombre-archivo.ts
 * ============================================================================
 * 
 * @description Descripción del propósito del archivo
 * 
 * @module Ruta/Modulo
 * 
 * @author System
 * @created YYYY-MM-DD
 * 
 * @dependencies
 * - dependencia1
 * - dependencia2
 * 
 * @related-files
 * - archivo-relacionado-1
 * - archivo-relacionado-2
 * 
 * @exports
 * - export1
 * - export2
 * 
 * ============================================================================
 */
```

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Estado**: React Hooks
- **Arquitectura**: Clean Architecture

## 📝 Convenciones

- **Nombres de archivos**: kebab-case (`product.service.ts`)
- **Nombres de componentes**: PascalCase (`ProductCard.tsx`)
- **Nombres de hooks**: camelCase con prefijo `use` (`useProducts.ts`)
- **Nombres de servicios**: camelCase (`product.service.ts`)
- **Exports**: Named exports preferidos, default export para componentes

## 🚨 Notas Importantes

- El proyecto usa Supabase como backend (requiere Node.js 22+ para compatibilidad futura)
- Todos los componentes client-side tienen `'use client'` al inicio
- Los hooks manejan estado y efectos, las pages solo renderizan UI
- Los servicios contienen lógica de negocio, no lógica de UI
- Los repositorios encapsulan acceso a datos, no lógica de negocio
