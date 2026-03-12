import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { pdfService } from '@/services/pdfService';
import { experimentService } from '@/services/experimentService';
import { storageService } from '@/services/storageService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Error: Missing Supabase environment variables for PDF Export");
      return NextResponse.json({ error: "Configuration error. Please contact support." }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { experiment_id } = body;

    if (!experiment_id) {
      return NextResponse.json({ error: 'Experiment ID is required' }, { status: 400 });
    }

    // Identical logic to generate-pdf as requested to handle export
    const experimentData = await experimentService.getExperiment(experiment_id, user.id);

    // Generate PDF lab report
    const pdfBytes = await pdfService.generateLabReportPdf(experimentData);

    // Upload to Supabase storage
    const filePath = `${user.id}/${experiment_id}.pdf`;
    await storageService.uploadFile(pdfBytes, filePath, 'application/pdf');

    // Update experiment record
    await experimentService.updateExperimentReportPath(experiment_id, filePath);

    const { data: publicUrlData } = supabase
      .storage
      .from('labreports')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      file_path: filePath,
      download_url: publicUrlData.publicUrl
    }, { status: 201 });
  } catch (err: any) {
    console.error('Server Error (Export PDF API):', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
