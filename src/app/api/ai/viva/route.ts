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

    const { experiment_title, difficulty } = await request.json();
    if (!experiment_title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await aiService.generateVivaQuestions(experiment_title, difficulty);
    return NextResponse.json({ success: true, questions: result });
  } catch (err: any) {
    console.error('AI Viva Error:', err);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
