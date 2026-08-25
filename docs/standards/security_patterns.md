# Estándares y Patrones de Seguridad (Security Patterns)

Este documento define los patrones y prácticas de seguridad obligatorias para el desarrollo de la plataforma **Marketplace SaaS**, alineados con las guías de OWASP, Supabase Security Best Practices y estándares enterprise (Facebook, Amazon).

---

## 🔒 1. Autenticación y Gestión de Sesiones

- **Mecanismo Auth**: Supabase Auth con flujo PKCE (Proof Key for Code Exchange) para Next.js App Router.
- **Cookies y Sesión**: Las cookies de sesión deben configurarse como `HttpOnly`, `SameSite=Lax` y `Secure` en entornos de producción (HTTPS).
- **Recuperación de Contraseña**:
  - Los enlaces de recuperación se generan mediante `supabase.auth.resetPasswordForEmail(email, { redirectTo })`.
  - La redirección debe apuntar explícitamente a `/auth/callback?type=recovery` o `/auth/reset`.
  - Los tokens de un solo uso vencen automáticamente en un periodo no mayor a 1 hora.

---

## 🛡️ 2. Control de Acceso y RLS (Row Level Security)

Todas las tablas en Supabase tienen habilitado RLS (`ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`).

- **Regla de Lectura Pública (Productos y Categorías)**:
  - `products` y `categories` son de lectura pública para cualquier rol (invitados o autenticados) donde `is_deleted = false`.
- **Regla de Escritura y Propietario (Cart, Favorites, Orders, Products)**:
  - Los usuarios autenticados únicamente pueden modificar/eliminar registros donde `user_id = auth.uid()` o `buyer_id = auth.uid()` o `seller_id = auth.uid()`.
- **Protección de Datos Sensibles en Perfiles**:
  - Los datos personales del perfil (`email`, `is_admin`, `is_blocked`) están protegidos contra edición arbitraria por terceros.

---

## 🧹 3. Sanitización de Entradas y Prevención de Inyecciones

- **SQL Injection**: Todas las consultas a la base de datos se ejecutan a través del ORM/SDK de Supabase o mediante RPC preparadas con parámetros. Se prohíbe terminantemente la concatenación manual de cadenas en consultas SQL.
- **XSS (Cross-Site Scripting)**:
  - React/Next.js escapa de forma predeterminada cualquier variable renderizada en JSX.
  - Al renderizar campos de texto multilínea (ej. descripciones de productos o preguntas), se usa la propiedad `whitespace-pre-wrap` de Tailwind sin recurrir jamás a `dangerouslySetInnerHTML`.
- **Validación de Formularios**: Todas las entradas del cliente (email, precios, números de teléfono, texto de preguntas) se validan mediante expresiones regulares y esquemas rígidos antes de enviarse a la base de datos.

---

## 🌐 4. Seguridad en el Almacenamiento Local (Guest Cart)

- Los datos guardados en `localStorage` (como el carrito de invitados) solo almacenan información pública de los productos (`productId`, `quantity`, `title`, `price`, `image_url`, `seller_id`).
- Nunca se almacenan tokens JWT, contraseñas ni datos personales del usuario en `localStorage`.

---

## 🚨 5. Manejo de Errores y Registro de Auditoría

- Los errores en el cliente no deben exponer stack traces del servidor ni información interna de la infraestructura.
- Se muestran mensajes orientados al usuario mediante el componente estándar de interfaz (`<Modal>`).
