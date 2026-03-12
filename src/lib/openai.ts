import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing from environment variables");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MAX_TOKENS = 800;

export function validateAndSanitizeInput(input: string | undefined | null): string {
  if (!input) return "";
  return input.trim().slice(0, 8000);
}
