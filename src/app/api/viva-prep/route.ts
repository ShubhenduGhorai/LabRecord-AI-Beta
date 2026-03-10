import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

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

    // TODO: Integrate actual AI service to generate viva questions based on the title
    const mockQuestions = [
      {
        question: `What is the primary objective of the ${experiment_title} experiment?`,
        answer: 'To understand the fundamental principles and observe the outcomes.'
      },
      {
        question: 'Can you explain the theoretical background behind this experiment?',
        answer: 'It relies on standard scientific laws relevant to the topic.'
      },
      {
        question: 'What are the possible sources of error in this experiment?',
        answer: 'Human error in reading measurements, instrument calibration issues, and environmental factors.'
      }
    ];

    return NextResponse.json({ success: true, questions: mockQuestions }, { status: 200 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
