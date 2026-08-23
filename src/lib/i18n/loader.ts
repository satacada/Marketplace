// Cargar traducciones desde CDN o API
export async function loadTranslations(lang: string) {
  try {
    // Opción 1: Desde tu propio backend
    const response = await fetch(`/api/i18n/${lang}`);
    return await response.json();
    
    // Opción 2: Desde CDN (ejemplo con i18next)
    // const response = await fetch(`https://cdn.tu-sitio.com/i18n/${lang}.json`);
    // return await response.json();
  } catch (error) {
    console.error('Error cargando traducciones:', error);
    return null;
  }
}