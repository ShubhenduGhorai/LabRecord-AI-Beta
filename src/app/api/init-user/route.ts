import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server Error: Missing Supabase environment variables for Init User");
      return NextResponse.json({ error: "Configuration error. Please contact support." }, { status: 500 });
    }

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
        console.error("Database Error (Init User Subscription):", insertError);
        return NextResponse.json({ error: 'Failed to initialize your account subscription' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Server Error (Init User API):', error);
    return NextResponse.json(
      { error: 'Something went wrong during account initialization. Please refresh the page.' },
      { status: 500 }
    );
  }
}
