// Script para verificar variables de entorno de Supabase
console.log('Verificando variables de entorno de Supabase:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configurada' : '✗ No configurada');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configurada' : '✗ No configurada');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}