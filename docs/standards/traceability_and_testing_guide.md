# Guía de Trazabilidad, Modularidad y Pruebas (Traceability & Testing Standards)

Este documento define la norma obligatoria para garantizar que todos los cambios en el código de **Marketplace SaaS** sean **100% trazables, modulares y fáciles de mantener por cualquier desarrollador humano o IA**.

---

## 📍 1. Principio de Trazabilidad Exacta de Cambios

Cada modificación realizada en la plataforma debe registrarse y documentarse especificando:
1. **Archivo modificado:** Ruta absoluta o relativa precisa (ej. `src/app/marketplace/page.tsx`).
2. **Rango de Líneas / Componente Afectado:** (ej. `ProductCard` líneas 120-250).
3. **Motivo del Cambio:** Explicación técnica del requerimiento resuelto.
4. **Verificación:** Comando ejecutado para validar que la modificación no introdujo regresiones (`npx tsc --noEmit` / `npm run build`).

---

## 🧩 2. Estructura Modular y Desacoplada

- **Single Responsibility Principle (SRP)**:
  - Los componentes de interfaz (`src/components/`) solo contienen lógica de renderizado.
  - La lógica de negocio y llamadas a Supabase residen exclusivamente en los Custom Hooks (`src/features/<feature>/hooks/`).
  - Las consultas relacionales y adaptaciones de base de datos se encapsulan en Servicios (`src/features/<feature>/services/`).

---

## 🔍 3. Trazabilidad de Errores y Diagnóstico Rápido

- **Comentarios JSDoc en Funciones y Componentes**:
  Cada función o componente principal incluye su cabecera descriptiva:
  ```typescript
  /**
   * @component ProductCard
   * @description Renderiza la tarjeta compacta de producto con botones SVG de favoritos y carrito.
   * @location src/app/marketplace/page.tsx
   */
  ```
- **Captura de Errores con Modales**:
  Los errores de red o base de datos jamás fallan silenciosamente ni lanzan excepciones de navegador nativas (`alert()`). Se capturan en un bloque `try/catch` y se muestran en el componente `<Modal>`.

---

## 🧪 4. Pruebas y Validación Automatizada

- **Cero Errores de Tipado**: Ningún cambio se aprueba sin la salida exitosa de `npx tsc --noEmit` (código de salida 0).
- **Compilación de Producción**: Verificación continua mediante `npm run build` para garantizar que la generación de páginas dinámicas y estáticas (22 rutas) compile en tiempo récord.
