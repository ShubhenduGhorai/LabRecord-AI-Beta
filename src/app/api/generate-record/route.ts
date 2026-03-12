import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkToolUsage, incrementToolUsage } from '@/lib/usage';
import { openaiClient, validateAndSanitizeInput, MAX_TOKENS } from '@/lib/openai';
import { logAIRequest, logRateLimitViolation, logAPIError } from '@/lib/rate-limit';

export async function POST(request: Request) {
  let userId: string | undefined;

  try {
    const user = await getAuthenticatedUser();
    userId = user.id;

    // 1. Check Usage Limit (Legacy route defaults to 'lab-report')
    const toolId = 'lab-report';
    const usage = await checkToolUsage(userId, toolId);

    if (!usage.allowed) {
      logRateLimitViolation(userId, 'user', usage.plan);
      return NextResponse.json(
        {
          error: 'Usage limit reached',
          message: `You have exhausted your ${usage.limit} uses for this tool on the ${usage.plan} plan.`,
          tokens_remaining: 0,
          limit: usage.limit,
          plan: usage.plan,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { title, subject, description, prompt } = body;

    let sanitizedPrompt: string;
    try {
      const rawInput = prompt ?? [title, subject, description].filter(Boolean).join(' – ') ?? '';
      sanitizedPrompt = validateAndSanitizeInput(rawInput, 'Prompt');
    } catch (validationErr: any) {
      return NextResponse.json({ error: validationErr.message }, { status: 400 });
    }

    const systemPrompt = 'You are a helpful academic assistant that generates structured laboratory experiment reports. Respond only with valid JSON.';
    const userPrompt = `
Generate a structured laboratory experiment report.
${title ? `Title: ${title}` : ''}
${subject ? `Subject: ${subject}` : ''}
${description ? `Description: ${description}` : ''}
${!title && !subject && !description ? sanitizedPrompt : ''}

Provide a JSON response with these keys:
"title", "aim", "apparatus", "theory", "procedure", "result", "precautions", "conclusion"

Respond with valid JSON only.
`.trim();

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content received from OpenAI');

    const generatedData = JSON.parse(content);
    const tokensUsed = response.usage?.total_tokens;
    logAIRequest(userId, '/api/generate-record', tokensUsed);

    // 2. Increment Usage
    const { used } = await incrementToolUsage(userId, toolId);

    return NextResponse.json(
      {
        success: true,
        data: generatedData,
        usage: {
          limit: usage.limit,
          used: used,
          remaining: Math.max(0, usage.limit - used)
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof Response) return err;
    logAPIError('/api/generate-record', err, userId);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
