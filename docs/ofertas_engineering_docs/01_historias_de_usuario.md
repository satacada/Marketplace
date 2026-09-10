# 👤 Historias de Usuario: Aplicación de Ofertas & Promociones

Este documento contiene la matriz completa de **Historias de Usuario (User Stories)** para el módulo de Ofertas, Descuentos y Ventas Relámpago (*Flash Sales*), organizadas por épicas y roles del sistema.

---

## 🎭 Roles del Sistema
- **HU-BUY (Comprador / Deal Hunter):** Usuario final que busca ofertas locales y nacionales, reclama cupones y compra con descuento.
- **HU-SEL (Vendedor / Comercio):** Tienda o marca que crea, programa y analiza promociones y ofertas relámpago.
- **HU-ADM (Administrador de Plataforma):** Administrador que modera ofertas, aprueba campañas destacadas y previene fraudes.

---

## 📌 ÉPICA 1: Descubrimiento y Filtrado de Ofertas (Comprador)

### 🔹 HU-BUY-01: Búsqueda y Filtrado de Ofertas por Geolocalización
- **Como** Comprador de la plataforma,
- **Quiero** filtrar ofertas activas en un radio GPS de cercanía (1 km, 5 km, 10 km o nacional),
- **Para** encontrar promociones de retiro inmediato o envío rápido el mismo día.

#### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Filtrado de ofertas por cercanía de 5 km
  Dado que el usuario otorga permisos de geolocalización o ingresa su ciudad
  Cuando selecciona el filtro de cercanía "5 km" en la pestaña de Ofertas
  Entonces la plataforma despliega únicamente las ofertas con stock disponible de vendedores a menos de 5 km
  Y calcula la distancia estimada a cada comercio en tiempo real.
```

---

### 🔹 HU-BUY-02: Reclamación de Cupones con Descuento Progresivo
- **Como** Comprador registando o invitado,
- **Quiero** hacer clic en "Reclamar Cupón" dentro de una oferta activa,
- **Para** aplicar un descuento directo en mi carrito de compras sin ingresar códigos manualmente.

#### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Reclamar cupón de oferta con éxito
  Dado que el comprador visualiza una oferta con el botón "Reclamar Cupón del 20%"
  Cuando presiona el botón "Reclamar Cupón"
  Entonces el cupón se vincula a su sesión/carrito automáticamente
  Y se muestra la notificación: "¡Cupón aplicado! Ahorras $X.XX en esta compra".
```

---

### 🔹 HU-BUY-03: Notificaciones de Ofertas Relámpago con Contador Regresivo
- **Como** Comprador,
- **Quiero** ver un contador regresivo (*Countdown Timer*) e indicador de stock disponible en las Ventas Relámpago,
- **Para** tomar decisiones de compra rápidas antes de que la promoción expire.

#### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Visualización de Oferta Relámpago próxima a vencer
  Dado que una oferta tiene un tiempo de validez de 2 horas y 50 unidades de stock
  Cuando el comprador ingresa a la ficha de la oferta
  Entonces ve un temporizador dinámico sincronizado al segundo
  Y una barra de progreso que indica el porcentaje de stock vendido (ej. "78% reservado").
```

---

## 📌 ÉPICA 2: Gestión de Promociones (Vendedor)

### 🔹 HU-SEL-01: Creación de Campañas de Oferta y Descuentos por Volumen
- **Como** Vendedor o Comercio registrado,
- **Quiero** publicar ofertas temporales, descuentos por porcentaje o combos (2x1, 3x2),
- **Para** acelerar la rotación de mi inventario y atraer nuevos clientes.

#### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Publicación exitosa de una oferta con stock limitado
  Dado que el vendedor está en su panel de administración de productos
  Cuando ingresa el precio original, el precio de oferta ($1500 -> $990) y el stock asignado a la promoción (20 unidades)
  Y define la fecha y hora de inicio y fin de la oferta
  Entonces la oferta se publica y se etiqueta con la insignia dinámicamente según el tema seleccionado.
```

---

### 🔹 HU-SEL-02: Analítica de Rendimiento de Ofertas en Tiempo Real
- **Como** Vendedor,
- **Quiero** ver cuántos usuarios han visto mi oferta, cuántos cupones han reclamado y la tasa de conversión,
- **Para** medir el retorno de inversión (ROI) de mis promociones.

#### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Consulta de métricas de campaña en el Dashboard
  Dado que el vendedor tiene una campaña activa
  Cuando ingresa a la pestaña "Rendimiento de Ofertas"
  Entonces visualiza gráficos de impresiones, cupones reclamados y ventas generadas en tiempo real.
```

---

## 📌 ÉPICA 3: Moderación y Control de Calidad (Administrador)

### 🔹 HU-ADM-01: Verificación Anti-Fraude en Precios de Oferta
- **Como** Administrador del Marketplace,
- **Quiero** que el sistema detecte falsas ofertas (aumento previo de precio antes del descuento),
- **Para** proteger el prestigio y la confianza de los compradores en la plataforma.

#### Criterios de Aceptación (Gherkin):
```gherkin
Escenario: Detección automática de oferta engañosa
  Dado que un vendedor intenta publicar una oferta donde el precio base fue elevado en los últimos 7 días
  Cuando envía la oferta a aprobación
  Entonces el sistema marca la oferta como "En Revisión por Precios Inflados"
  Y envía una alerta al panel de moderación del administrador.
```
