/**
 * ============================================================================
 * FILE: auth.validator.ts
 * ============================================================================
 * 
 * @description Validador específico para autenticación.
 *              Valida inputs de login, registro y perfil.
 * 
 * @module Shared/Validators
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - @/shared/constants/validation.constants.ts
 * - @/shared/utils/validation.utils.ts
 * 
 * @related-files
 * - @/features/auth/services/auth.service.ts
 * - @/features/auth/types/auth.types.ts
 * 
 * @exports
 * - validateLoginInput
 * - validateRegisterInput
 * - validateUpdateProfileInput
 * 
 * ============================================================================
 */

import { VALIDATION_RULES } from '../constants/validation.constants';
import { isValidEmail, isValidLength } from '../utils/validation.utils';
import { LoginInput, RegisterInput, UpdateProfileInput } from '@/features/auth/types/auth.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida input de login
 */
export function validateLoginInput(input: LoginInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.email) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(input.email)) {
    errors.email = 'Email inválido';
  }

  if (!input.password) {
    errors.password = 'La contraseña es requerida';
  } else if (!isValidLength(input.password, VALIDATION_RULES.PASSWORD_MIN_LENGTH, VALIDATION_RULES.PASSWORD_MAX_LENGTH)) {
    errors.password = `La contraseña debe tener entre ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} y ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} caracteres`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida input de registro
 */
export function validateRegisterInput(input: RegisterInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.email) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(input.email)) {
    errors.email = 'Email inválido';
  } else if (!isValidLength(input.email, VALIDATION_RULES.EMAIL_MIN_LENGTH, VALIDATION_RULES.EMAIL_MAX_LENGTH)) {
    errors.email = `El email debe tener entre ${VALIDATION_RULES.EMAIL_MIN_LENGTH} y ${VALIDATION_RULES.EMAIL_MAX_LENGTH} caracteres`;
  }

  if (!input.password) {
    errors.password = 'La contraseña es requerida';
  } else if (!isValidLength(input.password, VALIDATION_RULES.PASSWORD_MIN_LENGTH, VALIDATION_RULES.PASSWORD_MAX_LENGTH)) {
    errors.password = `La contraseña debe tener entre ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} y ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} caracteres`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida input de actualización de perfil
 */
export function validateUpdateProfileInput(input: UpdateProfileInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.store_name !== undefined) {
    if (!input.store_name.trim()) {
      errors.store_name = 'El nombre de la tienda es requerido';
    } else if (!isValidLength(input.store_name, VALIDATION_RULES.STORE_NAME_MIN_LENGTH, VALIDATION_RULES.STORE_NAME_MAX_LENGTH)) {
      errors.store_name = `El nombre debe tener entre ${VALIDATION_RULES.STORE_NAME_MIN_LENGTH} y ${VALIDATION_RULES.STORE_NAME_MAX_LENGTH} caracteres`;
    }
  }

  if (input.store_description !== undefined && input.store_description.length > 500) {
    errors.store_description = 'La descripción no puede exceder 500 caracteres';
  }

  if (input.phone !== undefined && input.phone && !/^\+?[\d\s-]{10,}$/.test(input.phone)) {
    errors.phone = 'Teléfono inválido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
