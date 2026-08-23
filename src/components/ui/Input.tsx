/**
 * ============================================================================
 * FILE: Input.tsx
 * ============================================================================
 * 
 * @description Componente de input reutilizable con validación visual.
 *              Soporta diferentes tipos, estados y mensajes de error.
 * 
 * @module Presentation/Components/UI
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * 
 * @related-files
 * - @/components/ui/Button.tsx
 * - @/shared/validators/auth.validator.ts
 * 
 * @exports
 * - Input (default)
 * 
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   label="Email"
 *   error={errors.email}
 *   value={email}
 *   onChange={handleChange}
 * />
 * ```
 * 
 * ============================================================================
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          appearance-none block w-full px-4 py-3 border rounded-lg
          placeholder-gray-400 text-gray-900 text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
