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
    const { title, subject, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // TODO: Integrate actual AI service (e.g., OpenAI/Gemini) to generate the report sections
    const generatedAim = `To study and understand ${title}`;
    const generatedApparatus = 'Standard laboratory equipment required for the experiment.';
    const generatedTheory = `Theoretical background of ${title} based on ${subject || 'general science'} principles.`;
    const generatedProcedure = '1. Set up the apparatus.\n2. Follow standard guidelines.\n3. Record observations.';
    const generatedResult = 'The experiment was conducted successfully and results match theoretical predictions.';

    const { data, error } = await supabase
      .from('experiments')
      .insert({
        user_id: user.id,
        title,
        subject,
        description,
        aim: generatedAim,
        apparatus: generatedApparatus,
        theory: generatedTheory,
        procedure: generatedProcedure,
        result: generatedResult,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving experiment:', error);
      return NextResponse.json({ error: 'Failed to save experiment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, experiment: data }, { status: 201 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
