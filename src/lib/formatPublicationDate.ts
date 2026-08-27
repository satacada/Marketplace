/**
 * ============================================================================
 * FILE: formatPublicationDate.ts
 * ============================================================================
 * 
 * @description Función de utilidad para formatear la fecha de publicación
 *              al estilo Facebook Marketplace (Imagen 2):
 *              - "Publicado hoy"
 *              - "Publicado ayer"
 *              - "Publicado el jueves" / "Publicado el martes"
 *              - "Publicado la semana pasada"
 *              - "Publicado hace X semanas"
 *              - "Publicado hace 1 mes" / "Publicado hace X meses"
 * 
 * @module Lib/FormatPublicationDate
 * ============================================================================
 */

export function formatPublicationDate(dateInput?: string | Date | null): string {
  if (!dateInput) return 'Publicado recientemente';

  const date = new Date(dateInput);
  const now = new Date();

  // Diferencia en milisegundos y días
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Publicado hoy';
  }

  if (diffDays === 1) {
    return 'Publicado ayer';
  }

  // Si fue durante esta misma semana (2 a 6 días)
  if (diffDays >= 2 && diffDays <= 6) {
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = daysOfWeek[date.getDay()];
    return `Publicado el ${dayName}`;
  }

  // Si fue la semana pasada (7 a 13 días)
  if (diffDays >= 7 && diffDays <= 13) {
    return 'Publicado la semana pasada';
  }

  // Si fue hace entre 2 y 4 semanas (14 a 29 días)
  if (diffDays >= 14 && diffDays <= 29) {
    const weeks = Math.floor(diffDays / 7);
    return `Publicado hace ${weeks} semanas`;
  }

  // Si hace más de un mes (30 a 59 días)
  if (diffDays >= 30 && diffDays <= 59) {
    return 'Publicado hace 1 mes';
  }

  // Si hace más de 2 meses
  if (diffDays >= 60) {
    const months = Math.floor(diffDays / 30);
    return `Publicado hace ${months} meses`;
  }

  return 'Publicado recientemente';
}
