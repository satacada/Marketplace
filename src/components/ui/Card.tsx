/**
 * ============================================================================
 * FILE: Card.tsx
 * ============================================================================
 * 
 * @description Componente de tarjeta reutilizable con diferentes variantes.
 *              Contenedor flexible para contenido con estilos consistentes.
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
 * - @/components/marketplace/ProductCard.tsx
 * 
 * @exports
 * - Card (default)
 * 
 * @example
 * ```tsx
 * <Card variant="default" className="p-6">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 * ```
 * 
 * ============================================================================
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-white border border-gray-200',
  outlined: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        rounded-lg
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
