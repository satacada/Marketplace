// Diccionario de errores de Supabase traducidos
// Fuente: https://supabase.com/docs/guides/auth/auth-error-codes
export const errorTranslations: Record<string, Record<string, string>> = {
  es: {
    'Invalid login credentials': 'Correo o contraseña incorrectos',
    'Email not confirmed': 'Email no confirmado. Revisa tu bandeja de entrada',
    'email rate limit exceeded': 'Demasiados intentos. Espera unos minutos o usa otro email',
    'User already registered': 'Este email ya está registrado',
    'Weak password': 'Contraseña muy débil. Usa al menos 6 caracteres',
    'Email confirmation is required': 'Debes confirmar tu email primero',
    'Refresh token not found': 'Sesión expirada. Inicia sesión de nuevo',
    'Invalid refresh token': 'Sesión inválida. Inicia sesión de nuevo',
    'Phone not confirmed': 'Teléfono no confirmado',
    'Identity not found': 'Usuario no encontrado',
    'Single identity not deletable': 'No se puede eliminar la única identidad',
    'Conflict': 'Conflicto. Intenta de nuevo',
    'not_found': 'No se encontró el recurso',
    'session_not_found': 'Sesión no encontrada',
    'flow_state_not_found': 'Estado del flujo no encontrado',
    'flow_state_expired': 'Estado del flujo expirado',
    'otp_expired': 'Código OTP expirado',
    'otp_disabled': 'OTP deshabilitado',
    'identity_not_found': 'Identidad no encontrada',
  },
  en: {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Email not confirmed. Check your inbox',
    'email rate limit exceeded': 'Too many attempts. Wait a few minutes',
    'User already registered': 'This email is already registered',
    'Weak password': 'Weak password. Use at least 6 characters',
  },
  pt: {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
  },
};

export function getErrorMessage(message: string, locale?: string): string {
  const lang = locale || navigator.language.split('-')[0] || 'es';
  const translations = errorTranslations[lang] || errorTranslations.es;
  
  return translations[message] || message;
}