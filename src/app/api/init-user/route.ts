import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if subscription already exists to prevent duplicate inserts
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!existingSub) {
      // Create initial free subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          plan_name: 'free',
          status: 'active',
          credits: 5
        }]);

      if (insertError) {
        console.error("Failed to insert subscription on signup:", insertError);
        return NextResponse.json({ error: 'Failed to initialize subscription' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in init-user:', error);
    return NextResponse.json(
      { error: error.message || 'Server error tracking init' },
      { status: 500 }
    );
  }
}
