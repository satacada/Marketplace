# 🧪 Plan de Pruebas y Matriz de Casos de Test: Aplicación de Ofertas

Este documento establece la estrategia de aseguramiento de calidad (QA), pruebas unitarias, de integración, pruebas de estrés y la matriz formal de casos de prueba para el módulo de **Ofertas & Ventas Relámpago (*Flash Sales*)**.

---

## 🎯 Estrategia de Testing

```
                    ┌─────────────────────────┐
                    │  Pruebas de Estrés /    │
                    │  Carga Anti-Bots        │
                    └───────────┬─────────────┘
                                │
                    ┌───────────┴─────────────┐
                    │ Pruebas de Integración  │
                    │ (Flujo Carrito/Checkout)│
                    └───────────┬─────────────┘
                                │
                    ┌───────────┴─────────────┐
                    │   Pruebas Unitarias     │
                    │   (Custom Hooks & UI)   │
                    └─────────────────────────┘
```

1. **Pruebas Unitarias (Jest / React Testing Library):** Validación de cálculo de porcentaje de descuento, hooks `useDealsEngine` y temporizadores de cuenta regresiva.
2. **Pruebas de Integración (Playwright / Cypress):** Flujo completo de navegación, reclamo de cupón en carrito y checkout de invitado sin registro obligatorio.
3. **Pruebas de Estrés / Carga (k6 / Artillery):** Simulación de alta concurrencia de compras simultáneas en ventas relámpago con límite de tasa (Rate Limiting).

---

## 📋 Matriz de Casos de Prueba (Test Cases)

| ID Caso | Módulo / Funcionalidad | Precondiciones | Pasos de Ejecución | Resultado Esperado | Criterio de Éxito |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DEAL-01** | Visualización de Oferta Relámpago | Oferta activa con temporizador de 1 hora y 10 unidades de stock. | 1. Navegar a `/marketplace`.<br>2. Observar la tarjeta de la oferta relámpago. | El temporizador descuenta los segundos en tiempo real y el stock indica "10 disponibles". | Se renderiza el contador dinámico y la barra de stock sin parpadeos. |
| **TC-DEAL-02** | Reclamo de Cupón por Invitado (Guest Cart) | Carrito de invitado vacío; usuario sin iniciar sesión. | 1. Seleccionar oferta de $1000 con 20% OFF.<br>2. Hacer clic en "Reclamar Oferta". | El ítem se agrega al carrito con el precio de $800 y se muestra el badge de descuento. | Transición fluida, precio ajustado correctamente a $800. |
| **TC-DEAL-03** | Agotamiento de Stock en Oferta | Oferta con `available_stock = 1`. | 1. Usuario A reclama la última unidad.<br>2. Usuario B intenta hacer clic en "Reclamar". | Para el Usuario B, el botón cambia inmediatamente a "Agotado" y se bloquea la acción. | Prevención de sobreventa (*Over-selling*) en base de datos. |
| **TC-DEAL-04** | Expiración Automática de Oferta | Oferta cuyo `end_at` se cumple mientras el usuario la visualiza. | 1. Permanecer en la página de la oferta hasta que la cuenta regresiva llegue a 00:00. | La UI se actualiza automáticamente deshabilitando la oferta y notificando su expiración. | El estado pasa a `expired` sin requerir recargar la página. |
| **TC-DEAL-05** | Prevención de Precios Inflados (Admin) | Vendedor intenta crear oferta aumentando el precio base en un 50%. | 1. Ingresar precio previo de $1000.<br>2. Subir precio base a $1500 y aplicar 20% OFF. | El sistema detecta el incremento sospechoso y retiene la publicación para revisión manual. | Alerta generada en el panel del Administrador. |

---

## ⚡ Pruebas de Rendimiento y Carga (Flash Sale Stress Test)

### Configuración del Test en k6 (Simulación de Concurrencia):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Rampa hasta 100 usuarios simultáneos
    { duration: '1m', target: 500 },  // Pico de 500 usuarios reclamando la oferta
    { duration: '30s', target: 0 },   // Enfriamiento
  ],
};

export default function () {
  const res = http.post('https://marketplace-saas.com/api/deals/claim', {
    deal_id: 'deal-flash-2026',
  });
  
  check(res, {
    'Status es 200 o 409 (Agotado sin error 500)': (r) => r.status === 200 || r.status === 409,
    'Tiempo de respuesta < 250ms': (r) => r.timings.duration < 250,
  });
  sleep(1);
}
```
