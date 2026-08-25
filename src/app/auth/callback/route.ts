import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type'); // 'signup', 'recovery', 'magiclink'
  const next = searchParams.get('next') || '/marketplace';

  // Si es un enlace de recuperación de contraseña, redirigir directamente al cliente con el código
  if (type === 'recovery') {
    const resetUrl = new URL('/auth/reset', request.url);
    if (code) {
      resetUrl.searchParams.set('code', code);
    }
    return NextResponse.redirect(resetUrl);
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=no-code', request.url));
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Para otros tipos (signup, magiclink), manejar normalmente en el servidor
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) {
    console.error('Error en callback:', error);
    return NextResponse.redirect(new URL('/auth?error=callback-failed', request.url));
  }
  
  return NextResponse.redirect(new URL(next, request.url));
}