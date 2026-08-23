import { NextResponse } from 'next/server';
import { errorTranslations } from '@/lib/i18n/errors';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  
  if (errorTranslations[lang]) {
    return NextResponse.json(errorTranslations[lang]);
  }
  
  return NextResponse.json({ error: 'Language not supported' }, { status: 404 });
}