/**
 * ============================================================================
 * FILE: localStorage.ts
 * ============================================================================
 * 
 * @description Utilidades para manejar localStorage de forma segura.
 *              Maneja errores y parseo JSON.
 * 
 * @module Shared/Utils
 * 
 * @author System
 * @created 2026-07-17
 * 
 * @dependencies
 * - none
 * 
 * @related-files
 * - none
 * 
 * @exports
 * - getLocalStorageItem
 * - setLocalStorageItem
 * - removeLocalStorageItem
 * 
 * ============================================================================
 */

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}
