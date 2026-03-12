import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { pdfService } from '@/services/pdfService';
import { experimentService } from '@/services/experimentService';
import { storageService } from '@/services/storageService';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Error: Missing Supabase environment variables for PDF Generation");
      return NextResponse.json({ error: "Configuration error. Please contact support." }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { experiment_id } = body;

    if (!experiment_id) {
      return NextResponse.json({ error: 'Experiment ID is required' }, { status: 400 });
    }

    // 1. Fetch experiment data from Supabase
    const experimentData = await experimentService.getExperiment(experiment_id, user.id);

    // 2. Generate PDF lab report using pdf-lib
    const pdfBytes = await pdfService.generateLabReportPdf(experimentData);

    // 3. Upload the PDF to Supabase storage bucket labreports
    const filePath = `${user.id}/${experiment_id}.pdf`;
    await storageService.uploadFile(pdfBytes, filePath, 'application/pdf');

    // 4. Save the file path in experiments.report_path
    await experimentService.updateExperimentReportPath(experiment_id, filePath);

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('labreports')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      file_path: filePath,
      download_url: publicUrlData.publicUrl
    });

  } catch (error: any) {
    console.error('Server Error (Generate PDF API):', error);
    return NextResponse.json(
      { error: 'Something went wrong while generating your PDF. Please try again.' },
      { status: 500 }
    );
  }
}
