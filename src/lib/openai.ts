import 'server-only';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

/**
 * Server-only OpenAI client.
 * Importing this file in client components will throw a build error,
 * preventing accidental exposure of the API key.
 */
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** Global token limit enforced on all AI generation calls. */
export const MAX_TOKENS = 800;

/** Maximum allowed prompt/input length in characters. */
export const MAX_INPUT_LENGTH = 2000;

/**
 * Sanitizes and validates input text for OpenAI prompts.
 * Returns the trimmed text or throws an error describing the violation.
 */
export function validateAndSanitizeInput(input: string | undefined | null, fieldName = 'Input'): string {
  if (!input || input.trim().length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }

  const trimmed = input.trim();

  if (trimmed.length > MAX_INPUT_LENGTH) {
    throw new Error(`${fieldName} exceeds the maximum length of ${MAX_INPUT_LENGTH} characters`);
  }

  // Basic sanitization — strip HTML tags and null bytes
  const sanitized = trimmed
    .replace(/<[^>]*>/g, '')   // strip HTML
    .replace(/\0/g, '');        // strip null bytes

  return sanitized;
}
