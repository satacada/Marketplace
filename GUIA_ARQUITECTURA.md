# Guía de Arquitectura y Programación Empresarial

## 📚 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Cómo Funciona Next.js](#cómo-funciona-nextjs)
3. [Patrones de Programación Empresarial](#patrones-de-programación-empresarial)
4. [Reglas y Normas del Proyecto](#reglas-y-normas-del-proyecto)
5. [Flujo de Datos](#flujo-de-datos)
6. [Funciones Más Importantes](#funciones-más-importantes)
7. [Buenas Prácticas Aplicadas](#buenas-prácticas-aplicadas)

---

## 🏗️ Arquitectura General

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │    Hooks     │         │
│  │  (app/)      │  │ (components/)│  │ (features/)  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                      APPLICATION LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Services   │  │   Hooks      │  │   Validators │         │
│  │ (services/)  │  │   (hooks/)   │  │(validators/) │         │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘         │
│         │                  │                                     │
│         └──────────────────┘                                     │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Repositories │  │   Database   │  │   Config     │         │
│  │(repositories)│  │ (supabase)   │  │  (config)    │         │
│  └──────┬───────┘  └──────────────┘  └──────────────┘         │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │
┌─────────┼─────────────────────────────────────────────────────────┐
│         │                    SHARED LAYER                           │
│  ┌──────┴──────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Types    │  │   Utils      │  │  Constants   │         │
│  │   (types/)  │  │   (utils/)   │  │(constants/)  │         │
│  └─────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Explicación de Capas

**1. PRESENTATION LAYER (Capa de Presentación)**
- **Propósito**: Mostrar datos al usuario y capturar interacciones
- **Componentes**: Pages, Components UI, Hooks de presentación
- **Regla**: No contiene lógica de negocio, solo renderizado y eventos

**2. APPLICATION LAYER (Capa de Aplicación)**
- **Propósito**: Contener lógica de negocio y coordinar operaciones
- **Componentes**: Services, Hooks de negocio, Validators
- **Regla**: No conoce detalles de implementación de datos

**3. INFRASTRUCTURE LAYER (Capa de Infraestructura)**
- **Propósito**: Acceso a datos y configuración externa
- **Componentes**: Repositories, Database, Config
- **Regla**: Implementación concreta de acceso a datos

**4. SHARED LAYER (Capa Compartida)**
- **Propósito**: Utilidades reutilizables en toda la aplicación
- **Componentes**: Types, Utils, Constants
- **Regla**: Sin dependencias de otras capas

---

## 🚀 Cómo Funciona Next.js

### Conceptos Fundamentales

**1. App Router (Next.js 13+)**
```
src/app/
├── layout.tsx          # Layout global de la aplicación
├── page.tsx            # Página principal (/)
├── auth/
│   ├── layout.tsx      # Layout específico para /auth
│   └── page.tsx        # Página /auth
└── dashboard/
    └── products/
        └── page.tsx    # Página /dashboard/products
```

**2. Server Components vs Client Components**

```typescript
// Server Component (default)
// Se ejecuta en el servidor, no puede usar hooks de React
export default function ServerComponent() {
  // ✅ Puede acceder a base de datos directamente
  // ✅ Puede usar async/await
  // ❌ No puede usar useState, useEffect
  return <div>Server Component</div>
}

// Client Component
// Se ejecuta en el cliente, puede usar hooks de React
'use client';
export default function ClientComponent() {
  // ✅ Puede usar useState, useEffect
  // ❌ No puede acceder a base de datos directamente
  const [count, setCount] = useState(0);
  return <div>Client Component: {count}</div>
}
```

**3. Routing Dinámico**
```typescript
// app/products/[id]/page.tsx
// [id] es un parámetro dinámico
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>
}
```

**4. Data Fetching**

```typescript
// Server Component con async/await
async function ProductsPage() {
  const products = await fetchProducts(); // Se ejecuta en el servidor
  return <ProductList products={products} />;
}

// Client Component con hooks
'use client';
function ProductsPage() {
  const { products, loading } = useProducts(); // Hook personalizado
  if (loading) return <div>Loading...</div>;
  return <ProductList products={products} />;
}
```

---

## 🎯 Patrones de Programación Empresarial

### 1. Repository Pattern (Patrón Repositorio)

**Propósito**: Abstraer el acceso a datos

```typescript
// Antes (acceso directo a DB)
const products = await supabase.from('products').select('*');

// Después (usando Repository)
const products = await productRepository.findAll();
```

**Implementación**:
```typescript
// BaseRepository - CRUD genérico
class BaseRepository<T> {
  async findAll(): Promise<T[]> { }
  async findById(id: string): Promise<T | null> { }
  async create(data: Partial<T>): Promise<T> { }
  async update(id: string, data: Partial<T>): Promise<T> { }
  async delete(id: string): Promise<void> { }
}

// ProductRepository - Específico de productos
class ProductRepository extends BaseRepository<Product> {
  async findBySeller(sellerId: string): Promise<Product[]> {
    return this.findAll({ filters: { seller_id: sellerId } });
  }
}
```

**Ventajas**:
- ✅ Testabilidad fácil (se puede mockear el repository)
- ✅ Cambio de DB sin afectar lógica de negocio
- ✅ Reutilización de código CRUD

### 2. Service Layer Pattern (Patrón Capa de Servicio)

**Propósito**: Contener lógica de negocio

```typescript
// productService.ts
export const productService = {
  async createProduct(input: CreateProductInput, userId: string) {
    // 1. Validar datos
    validateProductInput(input);
    
    // 2. Lógica de negocio
    if (input.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    
    // 3. Usar repository para guardar
    const product = await productRepository.create({
      ...input,
      seller_id: userId,
      status: 'pending'
    });
    
    return product;
  }
};
```

**Ventajas**:
- ✅ Lógica de negocio centralizada
- ✅ Reutilizable entre diferentes componentes
- ✅ Fácil de testear

### 3. Custom Hooks Pattern (Patrón Hooks Personalizados)

**Propósito**: Reutilizar lógica de estado y efectos

```typescript
// useProducts.ts
export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const data = await productService.getProducts(filters);
    setProducts(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refresh: fetchProducts };
}

// Uso en componente
function ProductsPage() {
  const { products, loading } = useProducts({ sellerId: userId });
  // Componente usa el hook, no conoce detalles de implementación
}
```

**Ventajas**:
- ✅ Lógica reutilizable
- ✅ Separación de concerns
- ✅ Fácil de testear

### 4. Dependency Injection (Inyección de Dependencias)

**Propósito**: Desacoplar componentes

```typescript
// Sin DI (acoplado)
class ProductController {
  private repository = new ProductRepository(); // Acoplado
}

// Con DI (desacoplado)
class ProductController {
  constructor(private repository: IProductRepository) {}
}

// Se puede inyectar diferentes implementaciones
const controller = new ProductController(new ProductRepository());
const testController = new ProductController(new MockRepository());
```

### 5. DTO Pattern (Data Transfer Objects)

**Propósito**: Transferir datos entre capas

```typescript
// Input DTO - para crear
interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  // No incluye id, created_at, etc.
}

// Output DTO - para respuesta
interface ProductResponse {
  id: string;
  title: string;
  price: number;
  // No incluye datos sensibles
}
```

---

## 📋 Reglas y Normas del Proyecto

### 1. Convenciones de Nombres

**Archivos**:
- kebab-case: `product.service.ts`, `use-products.ts`
- Componentes: PascalCase: `ProductCard.tsx`
- Hooks: camelCase con prefijo: `useProducts.ts`

**Carpetas**:
- Singular: `service/`, `repository/`, `hook/`
- Plural solo para colecciones: `components/`, `types/`

**Variables**:
- camelCase: `const productName = '...'`
- Constantes: UPPER_SNAKE_CASE: `const MAX_PRODUCTS = 100`

### 2. Estructura de Archivos

**Header de Documentación**:
```typescript
/**
 * ============================================================================
 * FILE: nombre-archivo.ts
 * ============================================================================
 * 
 * @description Descripción breve del propósito
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

### 3. Reglas de TypeScript

**Interfaces vs Types**:
- Use `interface` para objetos que pueden extenderse
- Use `type` para unions, intersections, primitives

```typescript
// ✅ Interface para objetos
interface Product {
  id: string;
  title: string;
}

// ✅ Type para unions
type ProductStatus = 'pending' | 'approved' | 'rejected';

// ✅ Type para intersections
type ProductWithCategory = Product & { category: Category };
```

**Strict Null Checks**:
```typescript
// ❌ Mal - puede ser null
function getProduct(id: string): Product {
  return repository.findById(id); // Puede ser null
}

// ✅ Bien - maneja null explícitamente
function getProduct(id: string): Product | null {
  return repository.findById(id);
}

// ✅ Mejor - con validación
function getProduct(id: string): Product {
  const product = repository.findById(id);
  if (!product) throw new Error('Product not found');
  return product;
}
```

### 4. Reglas de React

**Componentes Client**:
```typescript
'use client'; // Obligatorio al inicio

export default function MyComponent() {
  const [state, setState] = useState(); // ✅ Puede usar hooks
  return <div>{state}</div>;
}
```

**Hooks Rules**:
```typescript
// ✅ Correcto - hooks al nivel superior
function Component() {
  const [state, setState] = useState();
  useEffect(() => {}, []);
  return <div />;
}

// ❌ Incorrecto - hooks en condicionales
function Component() {
  if (condition) {
    const [state, setState] = useState(); // ERROR
  }
  return <div />;
}
```

### 5. Reglas de Next.js

**Server vs Client**:
```typescript
// ✅ Server Component (default)
export default function ServerPage() {
  return <div>Server</div>;
}

// ✅ Client Component
'use client';
export default function ClientPage() {
  return <div>Client</div>;
}
```

**Async Components**:
```typescript
// ✅ Server Component puede ser async
async function ProductsPage() {
  const products = await fetchProducts();
  return <ProductList products={products} />;
}

// ❌ Client Component no puede ser async
'use client';
async function ClientPage() { // ERROR
  const products = await fetchProducts();
  return <ProductList products={products} />;
}
```

---

## 🔄 Flujo de Datos

### Ejemplo: Crear un Producto

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER INTERACTION                                              │
│    Usuario llena formulario → ProductForm (Client Component)     │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│ 2. PRESENTATION LAYER                                            │
│    ProductForm llama a useProducts hook                          │
│    const { createProduct } = useProducts();                       │
│    await createProduct(input, userId);                           │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│ 3. APPLICATION LAYER                                             │
│    useProducts llama a productService.createProduct()             │
│    - Valida datos                                                │
│    - Aplica lógica de negocio                                   │
│    - Llama a repository                                          │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│ 4. INFRASTRUCTURE LAYER                                           │
│    productRepository.create()                                     │
│    - Convierte datos a formato DB                                │
│    - Ejecuta query SQL                                           │
│    - Retorna resultado                                            │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│ 5. DATA FLOW BACK                                                │
│    Repository → Service → Hook → Component → User                │
└─────────────────────────────────────────────────────────────────┘
```

### Código del Flujo

```typescript
// 1. Componente (Presentation)
function ProductForm() {
  const { createProduct } = useProducts();
  
  const handleSubmit = async (input: CreateProductInput) => {
    await createProduct(input, userId);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// 2. Hook (Application)
export function useProducts() {
  const createProduct = useCallback(async (input, userId) => {
    return await productService.createProduct(input, userId);
  }, []);
  
  return { createProduct };
}

// 3. Service (Application)
export const productService = {
  async createProduct(input: CreateProductInput, userId: string) {
    // Validación
    if (!input.title) throw new Error('Title required');
    
    // Lógica de negocio
    const productData = {
      ...input,
      seller_id: userId,
      status: 'pending'
    };
    
    // Llamada a repository
    return await productRepository.create(productData);
  }
};

// 4. Repository (Infrastructure)
class ProductRepository {
  async create(data: Partial<Product>): Promise<Product> {
    const { data: result } = await supabase
      .from('products')
      .insert(data)
      .select()
      .single();
    return result;
  }
}
```

---

## 🔑 Funciones Más Importantes

### 1. BaseRepository (Infraestructura)

```typescript
class BaseRepository<T> {
  // CRUD genérico reutilizable
  async findAll(options?: QueryOptions): Promise<T[]>
  async findById(id: string): Promise<T | null>
  async create(data: Partial<T>): Promise<T>
  async update(id: string, data: Partial<T>): Promise<T>
  async delete(id: string): Promise<void>
  async count(filters?: Record<string, any>): Promise<number>
}
```

**Por qué es importante**:
- Elimina código duplicado
- Proporciona interfaz consistente
- Facilita testing

### 2. Custom Hooks (Application)

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gestión de autenticación
  const login = useCallback(async (email, password) => { }, []);
  const logout = useCallback(async () => { }, []);

  return { user, isLoading, login, logout };
}
```

**Por qué es importante**:
- Reutiliza lógica de estado
- Separa lógica de UI
- Facilita testing

### 3. Services (Application)

```typescript
export const productService = {
  async createProduct(input, userId) { },
  async updateProduct(id, input, userId) { },
  async deleteProduct(id, userId) { },
  async getProducts(filters) { }
};
```

**Por qué es importante**:
- Centraliza lógica de negocio
- Reutilizable entre componentes
- Fácil de testear

### 4. Validators (Shared)

```typescript
export const productValidator = {
  validateCreate(input: CreateProductInput): ValidationResult {
    const errors: string[] = [];
    
    if (!input.title) errors.push('Title required');
    if (input.price <= 0) errors.push('Price must be positive');
    
    return { isValid: errors.length === 0, errors };
  }
};
```

**Por qué es importante**:
- Validación consistente
- Reutilizable
- Separación de concerns

---

## ✨ Buenas Prácticas Aplicadas

### 1. Separation of Concerns (Separación de Responsabilidades)

**Principio**: Cada módulo tiene una responsabilidad única

```typescript
// ❌ Mal - mezcla de responsabilidades
function ProductComponent() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Lógica de datos en componente
    supabase.from('products').select('*').then(data => {
      setProducts(data);
    });
  }, []);
  
  return <ProductList products={products} />;
}

// ✅ Bien - responsabilidades separadas
// Hook maneja datos
function useProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);
  return { products };
}

// Componente solo renderiza
function ProductComponent() {
  const { products } = useProducts();
  return <ProductList products={products} />;
}
```

### 2. DRY (Don't Repeat Yourself)

**Principio**: Evitar duplicación de código

```typescript
// ❌ Mal - código duplicado
function ProductList() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProducts().then(() => setLoading(false));
  }, []);
}

function CategoryList() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCategories().then(() => setLoading(false));
  }, []);
}

// ✅ Bien - reutilizar patrón
function useData<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFn().then(setData).finally(() => setLoading(false));
  }, [fetchFn]);
  
  return { data, loading };
}

function ProductList() {
  const { data: products, loading } = useData(fetchProducts);
}

function CategoryList() {
  const { data: categories, loading } = useData(fetchCategories);
}
```

### 3. Single Responsibility Principle (SRP)

**Principio**: Cada clase/módulo tiene una razón para cambiar

```typescript
// ❌ Mal - múltiples responsabilidades
class ProductManager {
  async saveToDB(product) { } // Responsabilidad 1
  async validate(product) { } // Responsabilidad 2
  async sendEmail(product) { } // Responsabilidad 3
}

// ✅ Bien - una responsabilidad cada uno
class ProductRepository {
  async save(product) { } // Solo guardar
}

class ProductValidator {
  validate(product) { } // Solo validar
}

class EmailService {
  async send(product) { } // Solo enviar emails
}
```

### 4. Dependency Inversion Principle (DIP)

**Principio**: Depender de abstracciones, no de implementaciones

```typescript
// ❌ Mal - depende de implementación concreta
class OrderService {
  private db = new PostgreSQLDatabase(); // Acoplado
}

// ✅ Bien - depende de abstracción
interface IDatabase {
  query(sql: string): Promise<any>;
}

class OrderService {
  constructor(private db: IDatabase) {} // Desacoplado
}
```

### 5. Error Handling

**Principio**: Manejar errores de manera consistente

```typescript
// ✅ Buen patrón de error handling
async function createProduct(input: CreateProductInput) {
  try {
    // Validar
    const validation = productValidator.validateCreate(input);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }
    
    // Crear
    const product = await productRepository.create(input);
    return { success: true, product };
    
  } catch (error) {
    // Manejar error
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

### 6. Type Safety

**Principio**: Usar TypeScript para prevenir errores

```typescript
// ✅ Tipos estrictos
interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
}

// ✅ Validación en tiempo de compilación
function updateProductPrice(product: Product, newPrice: number) {
  if (newPrice < 0) {
    throw new Error('Price cannot be negative');
  }
  return { ...product, price: newPrice };
}

// ✅ Generics para reutilización
class Repository<T extends BaseEntity> {
  async findById(id: string): Promise<T | null> { }
}
```

---

## 🎓 Resumen para Aprender

### Pasos para Entender el Código:

1. **Empieza por los Types**: Mira las interfaces en `types/` para entender las estructuras de datos
2. **Lee los Services**: Entiende la lógica de negocio en `services/`
3. **Mira los Hooks**: Ve cómo se usa la lógica en `hooks/`
4. **Revisa los Components**: Observa cómo se renderiza la UI
5. **Estudia los Repositories**: Entiende cómo se accede a los datos

### Flujo de Aprendizaje Sugerido:

1. **Semana 1**: TypeScript básico y React hooks
2. **Semana 2**: Next.js App Router y Server Components
3. **Semana 3**: Patrones de diseño (Repository, Service, Factory)
4. **Semana 4**: Arquitectura limpia y separación de concerns
5. **Semana 5**: Testing y buenas prácticas

### Recursos Recomendados:

- **TypeScript**: https://www.typescriptlang.org/docs/
- **React**: https://react.dev/learn
- **Next.js**: https://nextjs.org/docs
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **Design Patterns**: https://refactoring.guru/design-patterns

---

## 🚀 Próximos Pasos

Para continuar aprendiendo:

1. **Implementar un nuevo feature**: Sigue el patrón establecido
2. **Escribir tests**: Prueba cada capa independientemente
3. **Optimizar performance**: Usa React.memo, useMemo, useCallback
4. **Agregar logging**: Implementa logging estructurado
5. **Documentar APIs**: Usa herramientas como Swagger

Esta arquitectura proporciona una base sólida para aplicaciones empresariales escalables y mantenibles.
