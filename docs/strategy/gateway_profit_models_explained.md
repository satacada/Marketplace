# 💡 ¿Dónde Está la Ganancia de la Pasarela? Explicación Sencilla

Este documento responde de forma clara y directa a la pregunta:  
> *"Si un argentino vende un producto a $100 USD y el comprador paga $100 USDT, ¿dónde está mi ganancia como pasarela?"*

---

## 📊 Las 2 Formas Directas de Ganar Dinero como Pasarela

Existen 2 modelos de negocio según cómo decidas estructurar los cobros en tu plataforma:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   DÓNDE ESTÁ TU GANANCIA COMO PASARELA                      │
├──────────────────────────────────────────┬──────────────────────────────────┤
│ MODELO 1: COMISIÓN DIRECTA (SERVICE FEE) │ MODELO 2: DIFERENCIAL DE CAMBIO  │
│ - Cobra % sobre la venta                 │ - Gana con la brecha de cambio   │
│ - Cobras al Vendedor o al Comprador      │ - Convierte USDT a Moneda Local  │
│ - Ganancia: $3.50 a $5.00 USD por venta  │ - Ganancia: $5.00 a $13.00 USD   │
└──────────────────────────────────────────┴──────────────────────────────────┘
```

---

## 🔹 MODELO 1: Comisión Directa de Pasarela (El Modelo Tradicional)

En este modelo, el producto vale $100 USD en la etiqueta y tú cobras una comisión por procesar el pago.

### Opción A1: Comisión Descontada al Vendedor (Recomendado)
1. **Precio en Etiqueta:** $100 USD.
2. **El Comprador Paga:** $100 USDT.
3. **Tu Pasarela Recibe:** $100 USDT en tu cuenta de tesorería.
4. **Tu Pasarela Retiene tu Comisión de Pasarela (ej. 4%):** Te quedas con **$4 USDT**.
5. **Tu Pasarela Liquida al Vendedor:** Le transfieres **$96 USD** (o su equivalente en moneda local).

#### ¿Por qué el Vendedor acepta recibir $96 USD en vez de $100 USD?
Porque si el vendedor cobrara con **Mercado Pago o Visa/Mastercard**, le quitarían entre el **6.5% y el 8%** ($6.50 a $8.00 USD) y tendría que esperar 14 días.  
Con tu pasarela, el vendedor **ahorra dinero** (solo paga $4.00 USD) y recibe los fondos de inmediato.

* **💰 TU GANANCIA LIMPIA:** **$4.00 USDT (4% de la venta)**.

---

### Opción A2: Tarifa de Servicio (Service Fee) Cobrada al Comprador
1. **Precio en Etiqueta:** $100 USD.
2. **Tu Pasarela Suma una Tarifa de Procesamiento (ej. 3.5%):** El total a pagar en la pantalla de checkout es **$103.50 USDT**.
3. **El Comprador Paga:** $103.50 USDT.
4. **Tu Pasarela Liquida al Vendedor:** Le pagas exactamente sus **$100 USD**.
5. **Tu Pasarela Retiene:** **$3.50 USDT**.

* **💰 TU GANANCIA LIMPIA:** **$3.50 USDT (3.5% de la venta)**.

---

## 🔹 MODELO 2: Diferencial de Tipo de Cambio (Spread / Arbitraje)

Este es el modelo que usan las fintechs como Lemon, Ripio, Binance o Western Union cuando hay conversión de monedas.

### Ejemplo Práctico:
1. **El Vendedor Argentino quiere recibir:** **$100.000 Pesos ARS** por su producto.
2. **Tu Plataforma muestra en la Web el precio al comprador extranjero en Dólares/USDT:**
   * Supongamos que el Dólar Cripto en el mercado libre cotiza a **$1.150 Pesos ARS por USDT**.
   * El precio real en USDT de esos $100.000 Pesos sería de **86.95 USDT** ($100.000 / 1.150).
3. **Tu Pasarela fija un tipo de cambio de conversión con tu margen (ej. $1.050 Pesos por USDT):**
   * Al extranjero le muestras que el producto cuesta **$95.23 USDT** ($100.000 / 1.050).
4. **El Comprador Paga:** **$95.23 USDT**.
5. **Tu Pasarela Recibe:** **$95.23 USDT** en tu cuenta.
6. **Tu Pasarela vende esos $95.23 USDT en el mercado cripto local a $1.150 ARS:**  
   * $95.23 x 1.150 = **$109.514 Pesos ARS**.
7. **Le transfieres al Vendedor Argentino:** Sus **$100.000 Pesos ARS** prometidos.
8. **Tu Pasarela Retiene:** **$9.514 Pesos ARS** ($8.27 USDT equivalente).

* **💰 TU GANANCIA LIMPIA:** **$8.27 USDT (8.7% de la venta)** por hacer la conversión automática de moneda.

---

## 📈 Resumen Operativo

```
Venta de $100 USD ➔ Tu Pasarela cobra comisión (4%) ➔ Ganas $4 USDT por cada venta.
Venta de 1.000 productos al mes = 1.000 x $4 USDT = $4.000 USD/mes de Ganancia Neta Limpia.
```
