# Guía Especializada de Arquitectura Front-End (Front-End Specialist Standards)

Este documento define la arquitectura de software Front-End para **Marketplace SaaS**, optimizada para **Next.js 16 (App Router / Turbopack)** y **TypeScript Rígido**, cumpliendo con los estándares de ingeniería de **Meta (Facebook), Amazon Web Services y Vercel**.

---

## 🏗️ 1. Arquitectura de Componentes y Separación de Responsabilidades

- **React Server Components (RSC) vs Client Components (`'use client'`)**:
  - Las vistas principales renderizan la estructura shell y metadata en servidor.
  - Interacciones dinámicas (carrito, chat messenger, modal de geolocalización) están aisladas en Client Components modulares.
- **Custom Hooks por Feature**:
  - La lógica de negocio está desacoplada de la UI.
  - `useCart`: Gestiona el carrito (modo invitado en `localStorage` y modo autenticado en Supabase).
  - `useAuth`: Controla la sesión PKCE y el rol del usuario.
  - `useOrders`: Administra las compras e historial del usuario.

---

## ⚡ 2. Optimización de Core Web Vitals (Performance Standards)

- **LCP (Largest Contentful Paint) < 1.2s**:
  - Uso del componente `next/image` con tamaños responsivos, `loading="lazy"` para tarjetas de catálogo y `loading="eager"` para la imagen principal de producto.
- **INP (Interaction to Next Paint) < 100ms**:
  - Manejo de estados optimistas (Optimistic UI Updates) para agregar al carrito y favoritos de manera instantánea.
- **CLS (Cumulative Layout Shift) = 0**:
  - Contenedores de imagen con alturas fijas (`h-40 sm:h-44`) para evitar desplazamientos bruscos del layout durante la carga.

---

## 🔒 3. Tipado Rígido con TypeScript y Control de Excepciones

- Prohibido el uso de `any` explícito en código de producción.
- Todas las respuestas de la base de datos se mapean a interfaces estrictas (`CartSummary`, `Product`, `Order`, `Profile`).
- Manejo de errores mediante componentes estándar (`<Modal>`), evitando lanzamientos de excepciones no capturadas.

---

## 🗄️ 4. Persistencia e Integridad del Estado

- El estado del carrito de invitados se sincroniza en `localStorage` mediante la utilidad genérica `getLocalStorageItem` y `setLocalStorageItem`.
- Al iniciar sesión, la función de migración transfiere automáticamente los ítems del carrito local a la tabla `cart_items` de Supabase.
