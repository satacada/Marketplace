# 🔄 Diagramas de Interacción, Secuencia y Actividad: Aplicación de Ofertas

Este documento especifica el comportamiento dinámico y flujo de interacción de datos para el módulo de **Ofertas y Ventas Relámpago (*Flash Sales*)**.

---

## 1. Diagrama de Secuencia: Flujo de Reclamo y Redención de Oferta

```mermaid
sequenceDiagram
    autonumber
    actor Comprador as 🛒 Comprador / Guest
    participant Catalog as 📱 Catálogo de Ofertas (Client UI)
    participant DealsHook as 🎣 useDealsEngine (Hook)
    participant API as ⚡ API Endpoint / Server Action
    participant DB as 🗄️ Supabase Postgres (Deals & Cart)

    Comprador->>Catalog: Selecciona Oferta y hace clic en "Reclamar Oferta"
    Catalog->>DealsHook: claimDeal(dealId, buyerId)
    DealsHook->>API: POST /api/deals/claim { deal_id, user_id }
    
    rect rgb(240, 248, 255)
        note right of API: Validación de Reglas de Negocio
        API->>DB: Verificar vigencia (valid_until > NOW())
        API->>DB: Verificar stock de la oferta (available_stock > 0)
        API->>DB: Verificar límite por usuario (claimed_count < max_per_user)
    end

    alt Reglas de Negocio Válidas
        DB-->>API: Validación Exitosa & Reserva de Stock (-1)
        API->>DB: Insertar registro en `deal_claims` & agregar ítem al Carrito
        DB-->>API: Confirmación de transacción
        API-->>DealsHook: { success: true, coupon_code: "FLASH-2026", discount: 20 }
        DealsHook-->>Catalog: Actualiza estado a "¡Oferta Reclamada!"
        Catalog-->>Comprador: Muestra badge de descuento en Carrito y lanza confetti
    else Oferta Agotada o Expirada
        DB-->>API: Stock Insuficiente o Expirado
        API-->>DealsHook: { success: false, reason: "Oferta Agotada" }
        DealsHook-->>Catalog: Notifica error amigable
        Catalog-->>Comprador: Muestra modal "Lo sentimos, las unidades de esta oferta se han agotado"
    end
```

---

## 2. Diagrama de Actividad: Control de Cola Justa Anti-Bots (Fair Queue System)

```mermaid
flowchart TD
    A[Inicio: Usuario intenta comprar en Flash Sale] --> B{¿Usuario Autenticado o Invitado?}
    
    B -->|Invitado| C[Asignar Token de Sesión Persistente Guest Session]
    B -->|Autenticado| D[Obtener ID de Usuario]
    
    C --> E[Enviar solicitud de entrada a la Cola Justa]
    D --> E
    
    E --> F{¿Stock disponible en la oferta?}
    
    F -- No --> G[Mostrar pantalla: 'Oferta Agotada']
    G --> H[Ofrecer productos similares o suscribir a alertas]
    
    F -- Sí --> I{¿Solicitud sobrepasa tasa límite Rate Limit?}
    
    I -- Sí (Posible Bot) --> J[Activar Verificación CAPTCHA Invisible]
    J --> K{¿CAPTCHA Válido?}
    K -- No --> L[Bloquear IP / Solicitud Rechazada]
    K -- Sí --> M[Reservar Ítem en Cola por 10 Minutos]
    
    I -- No (Tráfico Normal) --> M
    
    M --> N[Agregar Producto con Descuento al Checkout]
    N --> O{¿Completa la compra en < 10 min?}
    
    O -- Sí --> P[Confirmar Pedido & Liberar Comprobante Escrow]
    O -- No --> Q[Expirar reserva de tiempo y devolver stock a la oferta]
    
    P --> R[Fin del Flujo]
    Q --> R
```

---

## 3. Arquitectura de Componentes del Motor de Ofertas

```mermaid
graph TD
    subgraph UI_Layer [Capa de Presentación - Componentes]
        A[<DealsBanner />] --> B[<FlashSaleCountdown />]
        A --> C[<DealCard />]
        C --> D[<ClaimCouponButton />]
        C --> E[<GeoDistanceBadge />]
    end

    subgraph Logic_Layer [Capa de Lógica - Custom Hooks]
        F[useDealsEngine] --> G[useFlashSaleTimer]
        F --> H[useGeoLocationOffers]
    end

    subgraph Service_Layer [Capa de Servicios]
        I[deal.service.ts] --> J[Supabase Client REST / RLS]
    end

    UI_Layer --> Logic_Layer
    Logic_Layer --> Service_Layer
```
