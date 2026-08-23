/**
 * ============================================================================
 * FILE: order.validator.ts
 * ============================================================================
 * 
 * @description Validador específico para órdenes.
 *              Valida inputs de creación y actualización de órdenes.
 * 
 * @module Shared/Validators
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/constants/validation.constants.ts
 * 
 * @related-files
 * - @/features/orders/services/order.service.ts
 * - @/features/orders/types/order.types.ts
 * 
 * @exports
 * - validateCreateOrderInput
 * - validateUpdateOrderStatus
 * 
 * ============================================================================
 */

import { VALIDATION_RULES } from '../constants/validation.constants';
import { CreateOrderInput } from '@/features/orders/types/order.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida input de creación de orden
 */
export function validateCreateOrderInput(input: CreateOrderInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Validar buyerId
  if (!input.buyerId || !input.buyerId.trim()) {
    errors.buyerId = 'El ID del comprador es requerido';
  }

  // Validar items
  if (!input.cartItems || input.cartItems.length === 0) {
    errors.cartItems = 'Debe haber al menos un item en la orden';
  } else {
    input.cartItems.forEach((item, index) => {
      if (!item.productId || !item.productId.trim()) {
        errors[`cartItems.${index}.productId`] = 'El ID del producto es requerido';
      }

      if (item.quantity === undefined || item.quantity === null) {
        errors[`cartItems.${index}.quantity`] = 'La cantidad es requerida';
      } else if (item.quantity <= 0) {
        errors[`cartItems.${index}.quantity`] = 'La cantidad debe ser mayor a 0';
      }

      if (item.price === undefined || item.price === null) {
        errors[`cartItems.${index}.price`] = 'El precio es requerido';
      } else if (item.price <= 0) {
        errors[`cartItems.${index}.price`] = 'El precio debe ser mayor a 0';
      }
    });
  }

  // Validar dirección de envío (opcional pero si se proporciona debe ser válida)
  if (input.shippingAddress !== undefined && input.shippingAddress) {
    if (input.shippingAddress.length < 10) {
      errors.shippingAddress = 'La dirección de envío debe tener al menos 10 caracteres';
    } else if (input.shippingAddress.length > 200) {
      errors.shippingAddress = 'La dirección de envío no puede exceder 200 caracteres';
    }
  }

  // Validar ciudad (opcional pero si se proporciona debe ser válida)
  if (input.shippingCity !== undefined && input.shippingCity) {
    if (input.shippingCity.length < 2) {
      errors.shippingCity = 'La ciudad debe tener al menos 2 caracteres';
    } else if (input.shippingCity.length > 100) {
      errors.shippingCity = 'La ciudad no puede exceder 100 caracteres';
    }
  }

  // Validar teléfono (opcional pero si se proporciona debe ser válido)
  if (input.shippingPhone !== undefined && input.shippingPhone) {
    if (!/^\+?[\d\s-]{10,}$/.test(input.shippingPhone)) {
      errors.shippingPhone = 'Teléfono inválido';
    }
  }

  // Validar notas (opcional pero si se proporciona debe ser válida)
  if (input.notes !== undefined && input.notes) {
    if (input.notes.length > VALIDATION_RULES.MAX_TEXT_LENGTH) {
      errors.notes = `Las notas no pueden exceder ${VALIDATION_RULES.MAX_TEXT_LENGTH} caracteres`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida actualización de estado de orden
 */
export function validateUpdateOrderStatus(status: string): ValidationResult {
  const errors: Record<string, string> = {};

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  if (!status || !status.trim()) {
    errors.status = 'El estado es requerido';
  } else if (!validStatuses.includes(status)) {
    errors.status = 'Estado inválido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
