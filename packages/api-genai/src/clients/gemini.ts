import { GoogleGenAI } from "@google/genai";

/**
 * Canonical model identifiers.
 * - ARGON: 1M-token, maximum intelligence — for high-context DAG timelines
 * - FLASH: fast, balanced — for real-time budget slider updates & chat
 */
export const MODELS = {
  ARGON: "gemini-4-argon",
  FLASH: "gemini-3.8-flash",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

let _client: GoogleGenAI | null = null;

/**
 * Returns a singleton GoogleGenAI client.
 * Reads GOOGLE_GENERATIVE_AI_API_KEY from the environment.
 */
export function geminiClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
    if (!apiKey) {
      throw new Error(
        "GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set."
      );
    }
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}
