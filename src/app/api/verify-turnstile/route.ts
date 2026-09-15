import { NextResponse } from 'next/server';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * POST /api/verify-turnstile
 *
 * Verifies a Cloudflare Turnstile CAPTCHA token server-side.
 * Called before Supabase signup to block bot signups.
 *
 * Body: { token: string }
 * Returns: { success: true } or { success: false, error: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA token is missing' },
        { status: 400 }
      );
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error('Server Configuration Error: TURNSTILE_SECRET_KEY is missing');
      // Fail open in development if not configured — will fail in production
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { success: false, error: 'CAPTCHA service is temporarily unavailable.' },
        { status: 500 }
      );
    }

    // Verify with Cloudflare's API
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await verifyResponse.json();

    if (!data.success) {
      console.warn('Turnstile Verification Failed:', data['error-codes']);
      return NextResponse.json(
        {
          success: false,
          error: 'CAPTCHA verification failed. Please try again.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Server Error (Verify Turnstile API):', err);
    return NextResponse.json(
      { success: false, error: 'Internal system error. Please try again.' },
      { status: 500 }
    );
  }
}
