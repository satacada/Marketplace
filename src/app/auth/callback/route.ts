import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type'); // 'signup', 'recovery', 'magiclink'
  
  if (!code) {
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/auth/reset', request.url));
    }
    return NextResponse.redirect(new URL('/auth?error=no-code', request.url));
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Si es recuperación de contraseña, redirigir a la página dedicada de reset
  if (type === 'recovery') {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error en recuperación:', error);
      return NextResponse.redirect(new URL('/auth/reset?error=recovery-failed', request.url));
    }
    
    // Obtener el email del usuario
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email || '';
    
    // Redirigir a la página de reset con el email como parámetro
    return NextResponse.redirect(new URL(`/auth/reset?email=${encodeURIComponent(email)}`, request.url));
  }
  
  // Para otros tipos (signup, magiclink), manejar normalmente
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) {
    console.error('Error en callback:', error);
    return NextResponse.redirect(new URL('/auth?error=callback-failed', request.url));
  }
  
  return NextResponse.redirect(new URL('/marketplace', request.url));
}