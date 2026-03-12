import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkTokenUsage, incrementTokenUsage } from '@/lib/usage';
import { openaiClient, validateAndSanitizeInput, MAX_TOKENS } from '@/lib/openai';
import { logAIRequest, logRateLimitViolation, logAPIError } from '@/lib/rate-limit';

/**
 * POST /api/generate-record
 *
 * Generates an AI lab report with monthly token enforcement.
 *
 * Flow:
 *  1. Verify Supabase JWT                    → 401 if missing
 *  2. Validate & sanitize input              → 400 if bad
 *  3. Check monthly token balance            → 429 if exhausted
 *  4. Call OpenAI (server-side, max 800 tok) → 500 on error
 *  5. Increment token counter by 1
 *  6. Return { success, data, tokens_remaining }
 */
export async function POST(request: Request) {
  let userId: string | undefined;

  try {
    // ── Step 1: Authenticate ──────────────────────────────────────────────
    const user = await getAuthenticatedUser();
    userId = user.id;

    // ── Step 2: Parse & validate input ───────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const { title, subject, description, prompt } = body;

    let sanitizedPrompt: string;
    try {
      const rawInput =
        prompt ??
        [title, subject, description].filter(Boolean).join(' – ') ??
        '';
      sanitizedPrompt = validateAndSanitizeInput(rawInput, 'Prompt');
    } catch (validationErr: any) {
      return NextResponse.json({ error: validationErr.message }, { status: 400 });
    }

    // ── Step 3: Check monthly token balance ──────────────────────────────
    const usage = await checkTokenUsage(userId);

    if (!usage.allowed) {
      logRateLimitViolation(userId, 'user', usage.plan);
      return NextResponse.json(
        {
          error: 'Monthly token limit reached',
          message: `You have used all ${usage.limit} tokens for ${usage.month} on the ${usage.plan} plan. Your tokens reset on the 1st of next month.`,
          tokens_remaining: 0,
          limit: usage.limit,
          month: usage.month,
          plan: usage.plan,
        },
        { status: 429 }
      );
    }

    // ── Step 4: Call OpenAI (server-side only) ────────────────────────────
    const systemPrompt =
      'You are a helpful academic assistant that generates structured laboratory experiment reports. Respond only with valid JSON.';

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
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const generatedData = JSON.parse(content);
    const tokensUsed = response.usage?.total_tokens;
    logAIRequest(userId, '/api/generate-record', tokensUsed);

    // ── Step 5: Increment token counter (only after success) ──────────────
    const { tokens_used: newCount } = await incrementTokenUsage(userId);
    const tokens_remaining = Math.max(0, usage.limit - newCount);

    // ── Step 6: Return result ─────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        data: generatedData,
        tokens_remaining,
        tokens_used: newCount,
        limit: usage.limit,
        month: usage.month,
      },
      { status: 200 }
    );
  } catch (err: any) {
    // Re-throw Response objects (401 from getAuthenticatedUser)
    if (err instanceof Response) {
      return err;
    }

    logAPIError('/api/generate-record', err, userId);
    console.error("Server Error (Generate Record):", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
