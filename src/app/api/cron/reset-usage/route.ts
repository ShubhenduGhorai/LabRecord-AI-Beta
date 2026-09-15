import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Server Configuration Error: Missing Supabase Service Role keys for Cron');
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    // Use the service role key to bypass RLS and perform bulk updates
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // 1. Get current month in YYYY-MM format
    const currentMonth = new Date().toISOString().slice(0, 7);

    // 2 & 3. Find and update all users where month != currentMonth efficiently
    const { error } = await supabase
      .from('user_usage')
      .update({
        tokens_used: 0,
        month: currentMonth,
        updated_at: new Date().toISOString(),
      })
      .neq('month', currentMonth);

    if (error) {
      console.error('Database Error (Reset Usage Cron):', error.message);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully reset usage limits for new month: ${currentMonth}`,
    });
  } catch (err: any) {
    console.error('Server Error (Reset Usage Cron):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
