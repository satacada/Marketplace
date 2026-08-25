# Estándares de Escalabilidad y Rendimiento (Scalability Patterns)

Este documento define la arquitectura técnica para asegurar alta concurrencia, respuesta ultrarrápida y escalabilidad masiva en **Marketplace SaaS**, optimizado para Next.js 16 (App Router / Turbopack) y Supabase.

---

## ⚡ 1. Renderizado y Caché en Next.js

- **Server-Side Rendering (SSR) & Dynamic Routes**:
  - Las páginas de productos e índices dinámicos utilizan Server Components o llamadas cliente optimizadas con `useMemo` y `useCallback`.
- **Optimización de Imágenes (`next/image`)**:
  - Todas las imágenes de catálogo utilizan dimensiones optimizadas, `loading="lazy"` o `loading="eager"` según posición en la pantalla (above the fold).
- **Debounce en Búsquedas y Filtros**:
  - Todas las entradas de búsqueda por texto emplean `debounce(query, 300)` para evitar ráfagas inútiles de peticiones a la base de datos.

---

## 📊 2. Optimización de Base de Datos e Consultas SQL

- **Paginación e Infinite Scroll**:
  - Las consultas de catálogo no cargan el total de registros en memoria. Utilizan límites paginados (`limit: 20`, `page: X`) e `IntersectionObserver` para scroll infinito.
- **Indexación de Tablas**:
  - Índices B-Tree creados en `products(seller_id)`, `products(category_id)`, `products(created_at)`, `cart_items(buyer_id)` y `favorites(user_id, product_id)`.
- **Carga de Relaciones (Foreign Keys Join)**:
  - Las relaciones con `categories` y `profiles` se solicitan en una sola consulta estructurada (`select('*, categories(name), profiles(store_name)')`), eliminando el problema N+1.

---

## 🛒 3. Arquitectura del Carrito de Invitados (Guest Cart Storage)

- **Persistencia en Almacenamiento Local**:
  - Para usuarios no autenticados, las adiciones al carrito se escriben síncronamente en `localStorage` bajo la clave `guest_cart`.
- **Sincronización Transparente al Autenticarse**:
  - Al iniciar sesión o completarse el registro durante el checkout, los ítems de `guest_cart` se migran automáticamente a la tabla `cart_items` de Supabase vinculados al `buyer_id` del usuario recién autenticado.

---

## 📱 4. Geolocalización y Búsqueda por Radio

- **Indexación Geoespacial**:
  - La localidad y coordenadas se filtran mediante coincidencia espacial o radio de kilómetros (6 km, 10 km, 25 km, 50 km).
- **Fallbacks Móbiles**:
  - Integración nativa con `navigator.geolocation` para navegadores móviles y desktop con fallback a selección manual de ciudad/código postal.
