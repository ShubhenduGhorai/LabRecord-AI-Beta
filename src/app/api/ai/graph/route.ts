import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { aiService } from '@/services/aiService';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data } = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const result = await aiService.recommendGraph(data);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('AI Graph Error:', err);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
