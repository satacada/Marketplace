# Guía de Arquitectura Nivel Empresa (Amazon, Google & AliExpress Standards)

Este documento define la norma obligatoria para el desarrollo de software en **Marketplace SaaS**, basada en los estándares de ingeniería de alto nivel utilizados por **Amazon, Google y AliExpress**.

---

## 🏛️ 1. Principios Fundamentales (SOLID & Clean Architecture)

### 1. Single Responsibility Principle (SRP)
- **Ninguna vista / página (`page.tsx`) debe contener lógica de negocio directa, llamadas a API o manejo de estado complejo.**
- Cada archivo de vista (`page.tsx`) debe actuar exclusivamente como un **Shell de Orquestación** (< 150 líneas).
- La lógica de negocio, manejo de formularios, geolocalización y llamadas a Supabase residen exclusivamente en un **Custom Hook dedicado** (`src/features/<feature>/hooks/use<Feature>.ts`).

### 2. Descomposición Atómica de Interfaz (Component Modularization)
- Todo componente de interfaz debe dividirse en subcomponentes atómicos de **menos de 100-120 líneas por archivo**.
- Estructura limpia de carpetas por dominio:
  - `src/components/marketplace/catalog/`: Componentes del catálogo público.
  - `src/components/marketplace/detail/`: Componentes del detalle de producto.
  - `src/components/marketplace/creation/`: Componentes del asistente de publicación.
  - `src/components/sales/`: Componentes del panel de ventas.

### 3. Trazabilidad Humana & Documentación JSDoc Obligatoria
- Todos los archivos `.ts` y `.tsx` **DEBEN** incluir la cabecera JSDoc estandarizada al inicio del archivo:
```typescript
/**
 * ============================================================================
 * FILE: nombre_del_archivo.tsx
 * ============================================================================
 * 
 * @description Descripción clara de la responsabilidad única del componente.
 * 
 * @module Presentacion/Componentes/...
 * ============================================================================
 */
```

---

## 🚀 2. Patrones de Desarrollo Estilo Amazon / AliExpress

1. **Auto-Categorización & Ficha Técnica por IA:**
   - Detección en tiempo real de categorías y extracción de especificaciones técnicas verdaderas estilo AliExpress.
2. **Resiliencia & Fallback de Datos (Zero-Crash Policy):**
   - Todas las consultas a base de datos deben incluir un mecanismo de *fallback* para que la interfaz nunca se rompa ni muestre pantallas vacías erróneas.
3. **Core Web Vitals & Renderizado Fluido:**
   - Imágenes responsivas con `next/image`, lazy-loading en catálogo y actualización optimista del estado del carrito.

---

## 🧪 3. Verificación Rígida de Calidad

Cero errores en compilación TypeScript y build de producción:
```bash
npx tsc --noEmit
npm run build
```
