import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkAIRateLimit, logAIRequest, logRateLimitViolation, logAPIError } from '@/lib/rate-limit';
import { validateAndSanitizeInput } from '@/lib/openai';
import { aiService } from '@/services/aiService';
import { experimentService } from '@/services/experimentService';

export async function POST(request: Request) {
  let userId: string | undefined;

  try {
    // 1. Authenticate — throws Response(401) if not authenticated
    const user = await getAuthenticatedUser();
    userId = user.id;

    // 2. Parse request body
    const body = await request.json().catch(() => ({}));
    const { title, subject, description } = body;

    // 3. Validate & sanitize inputs
    let sanitizedTitle: string;
    try {
      sanitizedTitle = validateAndSanitizeInput(title, 'Title');
    } catch (validationError: any) {
      return NextResponse.json({ error: validationError.message }, { status: 400 });
    }

    // subject and description are optional but still sanitize if provided
    const sanitizedSubject = subject?.trim().slice(0, 200) ?? undefined;
    const sanitizedDescription = description
      ? validateAndSanitizeInput(description, 'Description')
      : undefined;

    // 4. Enforce per-plan AI rate limit
    const rateLimitResult = await checkAIRateLimit(userId, user.plan);
    if (!rateLimitResult.allowed) {
      logRateLimitViolation(userId, 'user', user.plan);
      return NextResponse.json(
        {
          error: 'Rate limit reached',
          message: `You have used all ${rateLimitResult.limit} daily AI requests on your ${user.plan} plan. Resets at ${rateLimitResult.resetAt}.`,
          resetAt: rateLimitResult.resetAt,
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

    // 5. Generate report content via OpenAI (server-side only)
    const aiContent = await aiService.generateReport(sanitizedTitle, sanitizedSubject, sanitizedDescription);

    logAIRequest(userId, '/api/generate-report');

    // 6. Persist experiment to database
    const experiment = await experimentService.createExperiment({
      userId,
      title: aiContent.title || sanitizedTitle,
      subject: sanitizedSubject,
      description: sanitizedDescription,
      aim: aiContent.aim,
      apparatus: aiContent.apparatus,
      theory: aiContent.theory,
      procedure: aiContent.procedure,
      result: aiContent.result,
      precautions: aiContent.precautions,
      conclusion: aiContent.conclusion,
    });

    return NextResponse.json(
      { success: true, experiment, remaining: rateLimitResult.remaining },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': rateLimitResult.resetAt,
        },
      }
    );
  } catch (err: any) {
    // Re-throw Response objects (401 from getAuthenticatedUser)
    if (err instanceof Response) {
      return err;
    }

    logAPIError('/api/generate-report', err, userId);
    console.error("Server Error (Generate Report):", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
