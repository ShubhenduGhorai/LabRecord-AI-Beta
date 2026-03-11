import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // DNS prefetch control
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Restrict feature access
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HTTP Strict Transport Security (1 year)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Content Security Policy
          // Allows: self, Supabase, Cloudflare Turnstile, Google OAuth, Vercel Analytics
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self, inline (Next.js needs this), Turnstile, Vercel Analytics
              "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
              // Styles: self + inline (Tailwind)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self, data URIs, all HTTPS (for storage)
              "img-src 'self' data: https:",
              // Frames: Turnstile runs in an iframe
              "frame-src https://challenges.cloudflare.com",
              // Connect: Supabase, OpenAI (server-side only), Vercel Analytics
              "connect-src 'self' https://hxdtsciwtkxwhysxxodw.supabase.co https://va.vercel-scripts.com",
              // Workers (Cloudflare Turnstile)
              "worker-src https://challenges.cloudflare.com",
            ].join('; '),
          },
        ],
      },
      // Explicitly disable caching for all API routes
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ];
  },
};

export default nextConfig;
