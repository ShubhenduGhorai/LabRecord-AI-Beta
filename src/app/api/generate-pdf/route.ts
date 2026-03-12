import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { pdfService } from '@/services/pdfService';
import { experimentService } from '@/services/experimentService';
import { storageService } from '@/services/storageService';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
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

    // Get public or signed URL based on your bucket config (assuming public for now, or returning path)
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
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
