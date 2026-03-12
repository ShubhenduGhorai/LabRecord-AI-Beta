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

    const body = await request.json();
    const { tool, content, options = {} } = body;

    if (!tool || !content) {
      return NextResponse.json({ error: 'Tool and content are required' }, { status: 400 });
    }

    // 1. Check Usage Limit
    const usage = await checkToolUsage(user.id, tool);
    if (!usage.allowed) {
      return NextResponse.json({ 
        error: 'Usage limit reached',
        message: `You have exhausted your ${usage.limit} uses for this tool. Upgrade to Pro for 200 annual uses.`,
        limit: usage.limit,
        plan: usage.plan
      }, { status: 429 });
    }

    // 2. Process based on tool
    let result;
    try {
      switch (tool) {
        case 'data-analysis':
          result = await aiService.analyzeData(content);
          break;
        case 'graph-generator':
          result = await aiService.recommendGraph(content);
          break;
        case 'lab-report':
          result = await aiService.generateReport(
            content.title || "Untitled Experiment", 
            content.subject, 
            content.description
          );
          break;
        case 'viva-prep':
          result = await aiService.generateVivaQuestions(content, options.difficulty);
          break;
        case 'research-format':
          result = await aiService.formatResearch(content, options.style);
          break;
        default:
          return NextResponse.json({ error: 'Invalid tool selected' }, { status: 400 });
      }
    } catch (aiError: any) {
      console.error(`AI ${tool} Error:`, aiError);
      return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again.' }, { status: 503 });
    }

    // 3. Increment Usage (only on success)
    const { used } = await incrementToolUsage(user.id, tool);

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
    console.error('Unified AI Route Error:', err);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
