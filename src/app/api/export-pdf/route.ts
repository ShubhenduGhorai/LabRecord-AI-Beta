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
    const { experiment_id, report_data } = body;

    if (!experiment_id || !report_data) {
      return NextResponse.json({ error: 'Experiment ID and report data are required' }, { status: 400 });
    }

    // Mock PDF generation process
    // In a real scenario, use libraries like pdfkit, jspdf, or a service to generate PDF buffer
    // and upload it to Supabase Storage, then get the URL.
    const mockPdfFilePath = `documents/${user.id}/${experiment_id}-report.pdf`;

    // Save report record in the database
    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        experiment_id: experiment_id,
        file_path: mockPdfFilePath,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving report record:', error);
      return NextResponse.json({ error: 'Failed to save report record' }, { status: 500 });
    }

    return NextResponse.json({ success: true, file_path: mockPdfFilePath, report: data }, { status: 201 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
