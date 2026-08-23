# CONTEXTO DEL PROYECTO - Marketplace SaaS Multi-Tenant

## STACK TECNOLÓGICO
- Next.js 16.2.10 (App Router) con Turbopack
- TypeScript (.tsx para componentes, .ts para lógica)
- Tailwind CSS para estilos
- Supabase (Auth, PostgreSQL, Storage)
- Alias de rutas: `@/` apunta a `./src/`

## ESTRUCTURA DE CARPETAS
src/
├── app/
│ ├── auth/page.tsx (Login/Registro)
│ ├── dashboard/
│ │ ├── layout.tsx (Sidebar + contenido)
│ │ ├── page.tsx (Dashboard principal)
│ │ ├── products/page.tsx (CRUD productos vendedor)
│ │ ├── questions/page.tsx (Preguntas recibidas)
│ │ ├── orders/page.tsx (Historial compras/ventas)
│ │ └── profile/page.tsx (Activar vendedor, editar tienda)
│ ├── marketplace/
│ │ ├── page.tsx (Catálogo público)
│ │ ├── ask/page.tsx (Hacer pregunta)
│ │ ├── cart/page.tsx (Ver carrito)
│ │ └── checkout/page.tsx (Finalizar compra)
│ ├── page.tsx (Redirige a /auth)
│ └── layout.tsx (Root layout con suppressHydrationWarning)
├── components/
│ ├── ImageGallery.tsx (Carrusel + lightbox reutilizable)
│ └── Sidebar.tsx (Menú lateral con roles)
└── lib/
└── supabase.ts (Cliente Supabase)


## BASE DE DATOS (Supabase PostgreSQL)

### Tablas creadas:
1. **profiles** (id, email, role ['buyer'|'seller'], store_name)
   - Trigger automático al registrar usuario en auth.users
   
2. **products** (id, seller_id, title, description, price, stock, image_urls text[])
   - RLS: solo el vendedor puede ver/editar sus productos
   
3. **questions** (id, product_id, buyer_id, question, answer)
   - RLS: comprador ve sus preguntas, vendedor ve preguntas de sus productos
   
4. **cart_items** (id, buyer_id, product_id, quantity)
   - UNIQUE(buyer_id, product_id)
   - RLS: solo el comprador gestiona su carrito
   
5. **orders** (id, buyer_id, total_amount, status, created_at)
   - RLS: comprador ve sus órdenes
   
6. **order_items** (id, order_id, product_id, seller_id, quantity, price_at_purchase)
   - RLS: comprador ve items de sus órdenes, vendedor ve items de sus productos

### Storage:
- Bucket: `product-images` (público)
- Política: solo usuarios autenticados pueden subir (INSERT)

## FUNCIONALIDADES IMPLEMENTADAS

### Autenticación y Roles
- Registro/Login con Supabase Auth
- Roles: buyer (por defecto) y seller (activable)
- Activación de vendedor requiere store_name
- Protección de rutas con redirección a /auth

### Productos (Multi-Tenant)
- Vendedor crea productos con hasta 3 imágenes
- Imágenes subidas a Supabase Storage con nombres únicos
- Aislamiento: cada vendedor solo ve sus productos en /dashboard/products
- En marketplace: vendedor ve sus productos pero no puede comprarlos (botón deshabilitado)

### Marketplace Público
- Catálogo con todos los productos (JOIN con profiles para store_name)
- Componente ImageGallery con carrusel y lightbox (click para ampliar)
- Botón "Agregar al carrito" (cambia a "Agregado" si ya está)
- Contador de items en carrito visible en header

### Carrito y Checkout
- Tabla cart_items con validación de duplicados
- Página /marketplace/cart con resumen y total
- Checkout simula compra: crea order + order_items, vacía carrito
- Redirección a /dashboard/orders con mensaje de éxito

### Pedidos
- Historial condicional: comprador ve sus compras, vendedor ve ventas de sus productos
- Muestra productos, cantidades, precios y estado

### Navegación
- Sidebar con menús condicionales por rol
- Layout de dashboard envuelve todas las páginas con sidebar
- Enlaces activos resaltados

## DECISIONES TÉCNICAS IMPORTANTES
- Uso de alias `@/` para imports (configurado en tsconfig.json)
- `suppressHydrationWarning` en body para evitar errores de Grammarly
- Componentes reutilizables (ImageGallery, Sidebar)
- Estado local con useState para UI, Supabase para persistencia
- Checkout simulado (sin pasarela de pagos real aún)

## PENDIENTES PARA COMPLETAR MVP
1. **Panel de Administrador (Super Admin)**
   - Ver todas las tiendas y usuarios
   - Bloquear vendedores
   - Ver métricas de plataforma
   
2. **Despliegue a Producción**
   - Subir a Vercel
   - Configurar variables de entorno
   - Dominio personalizado (opcional)

## FASES FUTURAS (post-MVP)
- Categorías de productos
- Búsqueda y filtros avanzados
- Integración de pasarela de pagos real (Stripe/MercadoPago)
- Sistema de reseñas y calificaciones
- Notificaciones por email