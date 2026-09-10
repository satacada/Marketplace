/**
 * ============================================================================
 * FILE: MobileBottomBar.tsx
 * ============================================================================
 * 
 * @description Barra de navegación táctil inferior optimizada para móviles (Thumb Zone).
 *              Establece zonas de toque táctil de mínimo 44px x 44px con íconos dinámicos
 *              `<AppIcon>` e indicador en vivo de ítems en carrito.
 * 
 * @module Presentation/Components/Layout/MobileBottomBar
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppIcon from '@/components/ui/icons/AppIcon';

interface MobileBottomBarProps {
  cartItemCount?: number;
}

export default function MobileBottomBar({ cartItemCount = 0 }: MobileBottomBarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/marketplace', label: 'Inicio', icon: 'home' as const },
    { href: '/marketplace?focus=search', label: 'Buscar', icon: 'search' as const },
    { href: '/marketplace/cart', label: 'Carrito', icon: 'cart' as const, badge: cartItemCount },
    { href: '/marketplace/favorites', label: 'Favoritos', icon: 'heart' as const },
    { href: '/dashboard/profile', label: 'Perfil', icon: 'user' as const },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200/90 dark:border-slate-800 shadow-lg px-2 py-1">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition relative select-none cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <AppIcon name={item.icon} size="md" />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
