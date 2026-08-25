# Estándares de Diseño y UI/UX (Design Patterns)

Este documento establece las pautas de diseño visual, sistema de componentes y experiencia de usuario para **Marketplace SaaS**, basadas en estándares de plataformas e-commerce líderes como **Facebook Marketplace, Amazon y AliExpress**.

---

## 🎨 1. Sistema de Colores y Paleta Visual

- **Color Primario (Blue)**:
  - Marca / Botones principales: `bg-blue-600` (`#2563eb`).
  - Hover / Estados activos: `hover:bg-blue-700`, `active:bg-blue-800`.
  - Fondos suaves / Badges: `bg-blue-50`, `text-blue-600`, `border-blue-200`.
- **Colores Secundarios Neutros**:
  - Fondos de página: `bg-gray-50` / `bg-slate-50`.
  - Tarjetas y Contenedores: `bg-white`, `border-gray-200`, `shadow-xs` o `shadow-sm`.
  - Texto principal: `text-gray-900` / `text-gray-800`.
  - Texto secundario: `text-gray-500` / `text-gray-600`.
- **Estados y Badges**:
  - Éxito / En Stock: `bg-green-50 text-green-700 border-green-200`.
  - Alerta / Sin Stock: `bg-red-50 text-red-700 border-red-200`.
  - Advertencia: `bg-amber-50 text-amber-700 border-amber-200`.

---

## 📐 2. Disposición Grid y Tarjetas Compactas

- **Grid de Productos (Marketplace Main)**:
  - Móvil: 2 columnas (`grid-cols-2`).
  - Tablet: 3 columnas (`sm:grid-cols-3`).
  - Desktop: 4 a 5 columnas (`md:grid-cols-4 lg:grid-cols-5 gap-3.5`).
- **Tarjetas Compactas (Compact Product Cards)**:
  - Relación de aspecto de imagen: Fija y uniforme (`h-36 sm:h-44 object-cover rounded-t-xl`).
  - Precios destacados: Tipografía extra bold grande (`text-lg font-extrabold text-blue-600`).
  - Subtítulo de localidad: Origen visible de la publicación (ej: `Quilmes Oeste, BA`).
  - Acciones rápidas (Hover overlay):
    - Botón de carrito (`🛒`) con tooltip "Añadir al carrito".
    - Botón de favoritos (`❤️` / `🤍`) con tooltip "Agregar a favoritos".

---

## 💬 3. Interfaz de Chat Messenger (Comprador - Vendedor)

- **Diseño Split-Screen**:
  - Panel izquierdo con listado de conversaciones activas, avatar del vendedor y vista previa del último mensaje.
  - Panel derecho con el hilo de mensajes activo.
- **Burbujas de Mensaje**:
  - Mensajes del comprador: Alineados a la derecha con fondo azul `bg-blue-600 text-white rounded-2xl rounded-tr-xs`.
  - Mensajes del vendedor: Alineados a la izquierda con fondo gris `bg-gray-100 text-gray-800 rounded-2xl rounded-tl-xs`.

---

## ♿ 4. Accesibilidad y Micro-Interacciones

- Todos los botones e imágenes cuentan con atributos `title`, `alt` y `aria-label`.
- Animaciones suaves de transición (`transition-all duration-200 ease-in-out`).
- Diálogos y modales con comportamiento accesible (`onClose` al hacer clic fuera o presionar `Escape`).
