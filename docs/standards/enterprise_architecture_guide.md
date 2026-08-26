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

---

## 🚀 4. Metodología Oficial: Prototipado Modular Incremental ("Clean-by-Design")

Todo agente de IA o desarrollador humano DEBE seguir este flujo de 3 pasos en cada iteración o cambio:

1. **Construcción Limpia Inmediata (Sin Borradores Monolíticos):**
   - Desde la primera respuesta o solicitud de cambio, el código se estructura directamente en su Custom Hook y subcomponentes modulares de menos de 100 líneas con JSDoc.
2. **Ajustes Quirúrgicos Visuales:**
   - Cuando el usuario solicita ajustes de UI/UX, el agente modifica únicamente el subcomponente atómico correspondiente, sin alterar la lógica de negocio ni el estado global.
3. **Cierre de Calidad en Producción:**
   - Se ejecuta inmediatamente `npx tsc --noEmit` y `npm run build` antes de finalizar.
