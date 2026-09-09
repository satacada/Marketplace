/**
 * ============================================================================
 * FILE: iconPacks.ts
 * ============================================================================
 * 
 * @description Registro centralizado de paquetes de iconos (Amazon Clean, Heroicons, Emoji).
 *              Permite cambiar todo el set de iconos del sistema desde 1 lugar.
 * 
 * @module Presentation/Components/UI/Icons
 * ============================================================================
 */

export type IconName =
  | 'cart'
  | 'user'
  | 'logout'
  | 'search'
  | 'store'
  | 'star'
  | 'package'
  | 'location'
  | 'camera'
  | 'share'
  | 'heart'
  | 'heart-filled'
  | 'shipping'
  | 'shield'
  | 'return'
  | 'payment'
  | 'check'
  | 'filter';

export type IconPackName = 'amazon-clean' | 'heroicons' | 'emoji';

export const EMOJI_MAP: Record<IconName, string> = {
  cart: '🛒',
  user: '👤',
  logout: '🚪',
  search: '🔍',
  store: '🏪',
  star: '⭐',
  package: '📦',
  location: '📍',
  camera: '📷',
  share: '🔗',
  heart: '🤍',
  'heart-filled': '❤️',
  shipping: '⚡',
  shield: '🛡️',
  return: '🔄',
  payment: '💳',
  check: '✓',
  filter: '⚙️',
};
