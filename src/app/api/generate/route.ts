import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkAIRateLimit, logAIRequest, logRateLimitViolation, logAPIError } from '@/lib/rate-limit';
import { openai, validateAndSanitizeInput, MAX_TOKENS } from '@/lib/openai';

/**
 * POST /api/generate
 *
 * Secure, canonical AI generation endpoint.
 * - Verifies Supabase JWT (401 if unauthenticated)
 * - Validates and sanitizes input (400 if invalid)
 * - Enforces per-plan daily rate limits (429 if exceeded)
 * - Calls OpenAI with max_tokens enforced
 * - Returns generated content as JSON
 */
export async function POST(request: Request) {
  let userId: string | undefined;

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.error("Server Error: Missing OPENAI_API_KEY");
      return NextResponse.json({ error: "API configuration error." }, { status: 500 });
    }

    // 1. Authenticate
    const user = await getAuthenticatedUser();
    userId = user.id;

    // 2. Parse body
    const body = await request.json().catch(() => ({}));
    const { prompt, title, subject, description, type = 'report' } = body;

    // 3. Validate & sanitize input
    let sanitizedInput: string;
    try {
      // Accept either a direct prompt or title+subject+description fields
      const rawInput =
        prompt ??
        [title, subject, description].filter(Boolean).join(' – ') ??
        '';
      sanitizedInput = validateAndSanitizeInput(rawInput);
    } catch (validationError: any) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    // 4. Check per-user AI rate limit
    const rateLimitResult = await checkAIRateLimit(userId, user.plan);
    if (!rateLimitResult.allowed) {
      logRateLimitViolation(userId, 'user', user.plan);
      return NextResponse.json(
        {
          error: 'Rate limit reached',
          message: `You have reached your daily limit of ${rateLimitResult.limit} AI requests. Your limit resets at ${rateLimitResult.resetAt}.`,
          resetAt: rateLimitResult.resetAt,
          limit: rateLimitResult.limit,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt,
          },
        }
      );
    }

    // 5. Call OpenAI (server-side only, max_tokens enforced)
    const systemPrompt =
      type === 'viva'
        ? 'You are a helpful academic assistant that generates viva examination questions and answers for laboratory experiments. Respond only with valid JSON.'
        : 'You are a helpful academic assistant that generates structured laboratory experiment reports. Respond only with valid JSON.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: sanitizedInput },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const tokensUsed = response.usage?.total_tokens;
    logAIRequest(userId, '/api/generate', tokensUsed);

    return NextResponse.json(
      {
        success: true,
        data: JSON.parse(content),
        remaining: rateLimitResult.remaining,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': rateLimitResult.resetAt,
        },
      }
    );
  } catch (err: any) {
    // Re-throw Response objects (from getAuthenticatedUser 401)
    if (err instanceof Response) {
      return err;
    }

    logAPIError('/api/generate', err, userId);
    console.error('Server Error (Generate API):', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
