import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { aiService } from '@/services/aiService';
import { checkToolUsage, incrementToolUsage } from '@/lib/usage';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Check Usage Limit
    const toolId = 'data-analysis';
    const usage = await checkToolUsage(user.id, toolId);

    if (!usage.allowed) {
      return NextResponse.json({ 
        error: 'Usage limit reached',
        message: `You have exhausted your ${usage.limit} uses for ${toolId} on the ${usage.plan} plan.`,
        limit: usage.limit,
        plan: usage.plan
      }, { status: 429 });
    }

    const { data } = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const result = await aiService.analyzeData(data);

    // 2. Increment Usage (only on success)
    const { used } = await incrementToolUsage(user.id, toolId);

    return NextResponse.json({ 
      success: true, 
      result,
      usage: {
        limit: usage.limit,
        used: used,
        remaining: Math.max(0, usage.limit - used)
      }
    });
  } catch (err: any) {
    console.error('AI Analyze Error:', err);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
