import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { openai, MAX_TOKENS } from "@/lib/openai";
import { checkToolUsage, incrementToolUsage } from '@/lib/usage';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tool, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. Check Usage Limit
    const usage = await checkToolUsage(user.id, tool || 'lab-report');
    if (!usage.allowed) {
      return NextResponse.json({ 
        error: "Usage limit reached",
        message: `You have exhausted your ${usage.limit} uses. Upgrade to Pro for 200 annual uses.` 
      }, { status: 429 });
    }

    // 2. Direct OpenAI Call (Stable)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping students generate lab reports, analyze data, prepare viva questions, and format research documents. Respond only with valid JSON where structure is needed, otherwise provide clear academic text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: MAX_TOKENS
    });

    const result = completion.choices[0].message.content;

    // 3. Increment Usage
    await incrementToolUsage(user.id, tool || 'lab-report');

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error("AI SERVICE ERROR:", error);
    return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 500 });
  }
}
