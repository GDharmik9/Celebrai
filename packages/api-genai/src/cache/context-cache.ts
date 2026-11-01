import { geminiClient, MODELS } from "../clients/gemini.js";

/**
 * Creates a reusable context cache for large system instructions or
 * static reference documents (e.g., a vendor catalogue, event brief).
 *
 * Returns the cache name to pass as `cached_content` in subsequent interactions.
 */
export async function createContextCache(params: {
  systemInstruction: string;
  displayName?: string;
  /** TTL in seconds — default 3600 (1 hour) */
  ttlSeconds?: number;
}): Promise<string> {
  const client = geminiClient();
  const { systemInstruction, displayName = "celebrai-context", ttlSeconds = 3600 } = params;

  // Use the Caches API to create a persistent cached content resource
  const cache = await client.caches.create({
    model: MODELS.ARGON,
    config: {
      displayName,
      systemInstruction,
      ttl: `${ttlSeconds}s`,
    },
  });

  return cache.name ?? "";
}

/**
 * Lists all active context caches.
 */
export async function listContextCaches() {
  const client = geminiClient();
  const page = await client.caches.list();
  return page;
}

/**
 * Deletes a context cache by name.
 */
export async function deleteContextCache(cacheName: string): Promise<void> {
  const client = geminiClient();
  await client.caches.delete({ name: cacheName });
}
