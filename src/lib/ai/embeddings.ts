/**
 * Google Generative AI embeddings utility.
 * Uses text-embedding-004 (768-dimensional, free tier).
 */

const EMBEDDING_MODEL = "text-embedding-004";
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY!;

interface EmbeddingResponse {
  embedding: { values: number[] };
}

/**
 * Generate a single embedding vector for a given text string.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const cleanText = text.replace(/\s+/g, " ").trim().slice(0, 8192);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text: cleanText }] },
        taskType: "RETRIEVAL_DOCUMENT",
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding API error: ${response.status} — ${err}`);
  }

  const data: EmbeddingResponse = await response.json();
  return data.embedding.values;
}

/**
 * Generate embeddings for multiple texts in sequence.
 * Rate-limited to avoid hitting API limits.
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
    // Small delay to be gentle on the free tier
    await new Promise((r) => setTimeout(r, 100));
  }
  return results;
}
