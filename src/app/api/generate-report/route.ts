import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { aiService } from '@/services/aiService';
import { experimentService } from '@/services/experimentService';
import { userService } from '@/services/userService';

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

    // Check if the user is allowed to generate a report
    try {
      await userService.checkReportGenerationLimit(user.id);
    } catch (limitError: any) {
      return NextResponse.json({ error: limitError.message }, { status: 403 });
    }

    // Generate the report content using OpenAI
    const aiContent = await aiService.generateReport(title, subject, description);

    // Save the experiment to the database
    const experiment = await experimentService.createExperiment({
      userId: user.id,
      title: aiContent.title || title,
      subject,
      description,
      aim: aiContent.aim,
      apparatus: aiContent.apparatus,
      theory: aiContent.theory,
      procedure: aiContent.procedure,
      result: aiContent.result,
      precautions: aiContent.precautions,
      conclusion: aiContent.conclusion,
    });

    return NextResponse.json({ success: true, experiment }, { status: 201 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
