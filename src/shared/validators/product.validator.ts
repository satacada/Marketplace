/**
 * ============================================================================
 * FILE: product.validator.ts
 * ============================================================================
 * 
 * @description Validador específico para productos.
 *              Valida inputs de creación y actualización de productos.
 * 
 * @module Shared/Validators
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/constants/validation.constants.ts
 * - @/shared/constants/app.constants.ts
 * 
 * @related-files
 * - @/features/products/services/product.service.ts
 * - @/features/products/types/product.types.ts
 * 
 * @exports
 * - validateCreateProductInput
 * - validateUpdateProductInput
 * 
 * ============================================================================
 */

import { VALIDATION_RULES } from '../constants/validation.constants';
import { IMAGE_CONFIG } from '../constants/app.constants';
import { CreateProductInput, UpdateProductInput } from '@/features/products/types/product.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida input de creación de producto
 */
export function validateCreateProductInput(input: CreateProductInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Validar título
  if (!input.title || !input.title.trim()) {
    errors.title = 'El título es requerido';
  } else if (input.title.length < VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH) {
    errors.title = `El título debe tener al menos ${VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH} caracteres`;
  } else if (input.title.length > VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH) {
    errors.title = `El título no puede exceder ${VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH} caracteres`;
  }

  // Validar descripción
  if (!input.description || !input.description.trim()) {
    errors.description = 'La descripción es requerida';
  } else if (input.description.length < VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN_LENGTH) {
    errors.description = `La descripción debe tener al menos ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN_LENGTH} caracteres`;
  } else if (input.description.length > VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX_LENGTH) {
    errors.description = `La descripción no puede exceder ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres`;
  }

  // Validar precio
  if (input.price === undefined || input.price === null) {
    errors.price = 'El precio es requerido';
  } else if (input.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  } else if (input.price > 1000000) {
    errors.price = 'El precio no puede exceder $1,000,000';
  }

  // Validar stock
  if (input.stock === undefined || input.stock === null) {
    errors.stock = 'El stock es requerido';
  } else if (input.stock < 0) {
    errors.stock = 'El stock no puede ser negativo';
  } else if (input.stock > 10000) {
    errors.stock = 'El stock no puede exceder 10,000 unidades';
  }

  // Validar imágenes
  if (input.images && input.images.length > 0) {
    if (input.images.length > IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT) {
      errors.images = `Máximo ${IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT} imágenes permitidas`;
    }

    for (const image of input.images) {
      if (image.size > IMAGE_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.images = `La imagen ${image.name} excede el tamaño máximo de ${IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB`;
        break;
      }

      if (!IMAGE_CONFIG.ALLOWED_FORMATS.includes(image.type as any)) {
        errors.images = `Formato no permitido para ${image.name}`;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida input de actualización de producto
 */
export function validateUpdateProductInput(input: UpdateProductInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Validar título si se proporciona
  if (input.title !== undefined) {
    if (!input.title.trim()) {
      errors.title = 'El título es requerido';
    } else if (input.title.length < VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH) {
      errors.title = `El título debe tener al menos ${VALIDATION_RULES.PRODUCT_TITLE_MIN_LENGTH} caracteres`;
    } else if (input.title.length > VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH) {
      errors.title = `El título no puede exceder ${VALIDATION_RULES.PRODUCT_TITLE_MAX_LENGTH} caracteres`;
    }
  }

  // Validar descripción si se proporciona
  if (input.description !== undefined) {
    if (!input.description.trim()) {
      errors.description = 'La descripción es requerida';
    } else if (input.description.length < VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN_LENGTH) {
      errors.description = `La descripción debe tener al menos ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN_LENGTH} caracteres`;
    } else if (input.description.length > VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX_LENGTH) {
      errors.description = `La descripción no puede exceder ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres`;
    }
  }

  // Validar precio si se proporciona
  if (input.price !== undefined) {
    if (input.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0';
    } else if (input.price > 1000000) {
      errors.price = 'El precio no puede exceder $1,000,000';
    }
  }

  // Validar stock si se proporciona
  if (input.stock !== undefined) {
    if (input.stock < 0) {
      errors.stock = 'El stock no puede ser negativo';
    } else if (input.stock > 10000) {
      errors.stock = 'El stock no puede exceder 10,000 unidades';
    }
  }

  // Validar imágenes si se proporcionan
  if (input.images && input.images.length > 0) {
    if (input.images.length > IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT) {
      errors.images = `Máximo ${IMAGE_CONFIG.MAX_IMAGES_PER_PRODUCT} imágenes permitidas`;
    }

    for (const image of input.images) {
      if (image.size > IMAGE_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.images = `La imagen ${image.name} excede el tamaño máximo de ${IMAGE_CONFIG.MAX_FILE_SIZE_MB}MB`;
        break;
      }

      if (!IMAGE_CONFIG.ALLOWED_FORMATS.includes(image.type as any)) {
        errors.images = `Formato no permitido para ${image.name}`;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
