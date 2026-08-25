# Guía Especializada de Experiencia de Usuario (UX Specialist Standards)

Este documento contiene los estándares profesionales de **UX Specialist (Nivel Enterprise)** para la plataforma **Marketplace SaaS**, basados en las guías de diseño de **Facebook Marketplace, Amazon, Nielsen Norman Group (NNg) y Google Material Design 3**.

---

## 🎯 1. Principios de Embudo sin Fricción (Zero-Friction Conversion Funnel)

- **Guest First Shopping (Navegación e Inclusión Abierta)**:
  - El visitante puede explorar productos, filtrar por geolocalización, cambiar el radio de kilómetros y añadir ítems al carrito sin necesidad de autenticarse.
  - La barrera del registro únicamente se presenta cuando el usuario decide hacer clic en **"Proceder al Pago"**.
- **Retroalimentación Inmediata (Feedback Loop)**:
  - Toda acción (añadir a carrito, alternar favorito, cambiar ubicación) debe emitir una respuesta visual instantánea (Badge en header en menos de 50ms, animación suave en botón).

---

## 👁️ 2. Jerarquía Visual y Escaneo Rápido (Z-Pattern & F-Pattern)

- **Patrón Z en Tarjetas Compactas**:
  1. Esquina Superior Izquierda: Badges de Estado (🚚 Envío gratis, ⭐ Calificación).
  2. Esquina Superior Derecha: Botones flotantes de Acción Rápida (🛒 Añadir al Carrito, ❤️ Favoritos).
  3. Parte Inferior Izquierda: Precio grande en azul (`text-lg font-extrabold text-blue-600`).
  4. Subtítulo: Origen de ubicación visible (`📍 Quilmes Oeste, BA`).
- **Navegación Limpia y Sobria**:
  - Uso de tipografía legible con contrastes WCAG AA (texto primario `#111827`, texto secundario `#6B7280`).

---

## 📱 3. Paradigma Móvil-Primero (Mobile-First Touch Ergonomics)

- **Áreas Táctiles Mínimas (Touch Targets)**:
  - Todos los botones interactivos tienen un tamaño mínimo de `44px x 44px` en móviles (`w-11 h-11` o `p-3`).
- **Diseño Adaptativo Fluid Grid**:
  - Rejilla responsiva automática: 2 columnas en pantallas móviles (`grid-cols-2`), 3 en tablets (`sm:grid-cols-3`), 4 a 5 en desktop (`md:grid-cols-4 lg:grid-cols-5`).

---

## 💬 4. Experiencia de Mensajería Split-Screen (Messenger Patterns)

- **Interfaz de Chat Comprador-Vendedor**:
  - Panel izquierdo con listado de conversaciones activas con avatar del producto.
  - Panel derecho con hilo de mensajes de burbuja (azul para el comprador a la derecha, gris para el vendedor a la izquierda).
  - Selector directo de producto y resumen de precio en la barra superior.

---

## ♿ 5. Accesibilidad (WAI-ARIA Level AA)

- Todos los elementos interactivos tienen atributos `aria-label` y `title`.
- Diálogos y modales gestionan el foco del teclado y permiten cierre accesible con tecla `Escape` o clic fuera del contenedor.
