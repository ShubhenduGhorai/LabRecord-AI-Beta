import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { aiService } from '@/services/aiService';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { experiment_title } = body;

    if (!experiment_title) {
      return NextResponse.json({ error: 'Experiment title is required' }, { status: 400 });
    }

    // Integrate actual AI service to generate viva questions based on the title
    const questions = await aiService.generateVivaQuestions(experiment_title);

    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
