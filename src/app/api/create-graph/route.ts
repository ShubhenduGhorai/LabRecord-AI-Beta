import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { userService } from '@/services/userService';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { experiment_id, title, xAxis, yAxis, dataPoints } = body;

    // xAxis and yAxis can be strings (labels), dataPoints can be the actual x/y dataset
    if (!dataPoints || !Array.isArray(dataPoints)) {
      return NextResponse.json({ error: 'Valid data points are required' }, { status: 400 });
    }

    // Enforce subscription plan limit
    try {
      await userService.checkReportGenerationLimit(user.id);
    } catch (limitError: any) {
      return NextResponse.json({ error: limitError.message }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('graphs')
      .insert({
        user_id: user.id,
        experiment_id: experiment_id || null,
        title: title || 'Generated Graph',
        x_axis_label: xAxis || 'X Axis',
        y_axis_label: yAxis || 'Y Axis',
        data_points: dataPoints, // Assuming JSONB column
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving graph:', error);
      return NextResponse.json({ error: 'Failed to save graph' }, { status: 500 });
    }

    return NextResponse.json({ success: true, graph: data }, { status: 201 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
