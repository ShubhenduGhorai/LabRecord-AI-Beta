import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { aiService } from '@/services/aiService';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !openaiKey) {
      console.error("Server Error: Missing environment variables for Viva Prep");
      return NextResponse.json({ error: "Configuration error. Please contact support." }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { experiment_title } = body;

    if (!experiment_title) {
      return NextResponse.json({ error: 'Experiment title is required' }, { status: 400 });
    }

    // Integrate actual AI service to generate viva questions based on the title
    const questions = await aiService.generateVivaQuestions(experiment_title);

    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (err: any) {
    console.error('Server Error (Viva Prep API):', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
