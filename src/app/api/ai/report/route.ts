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
    const toolId = 'lab-report';
    const usage = await checkToolUsage(user.id, toolId);

    if (!usage.allowed) {
      return NextResponse.json({ 
        error: 'Usage limit reached',
        message: `You have exhausted your ${usage.limit} uses for ${toolId} on the ${usage.plan} plan.`,
        limit: usage.limit,
        plan: usage.plan
      }, { status: 429 });
    }

    const { title, subject, description } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await aiService.generateReport(title, subject, description);

    // 2. Increment Usage
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
    console.error('AI Report Error:', err);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
