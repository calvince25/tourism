/**
 * Vector store utility — wraps Supabase pgvector operations.
 * Uses the service-role client to bypass RLS for server-side operations.
 */

import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "./embeddings";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface KnowledgeChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  source_type: "tour" | "destination" | "faq" | "blog";
  source_id: string;
}

export interface SearchResult extends KnowledgeChunk {
  similarity: number;
}

/**
 * Upsert a knowledge chunk. Generates its embedding and saves to Supabase.
 */
export async function upsertChunk(chunk: KnowledgeChunk): Promise<void> {
  const embedding = await generateEmbedding(chunk.content);

  const { error } = await supabase.from("knowledge_chunks").upsert(
    {
      id: chunk.id,
      content: chunk.content,
      metadata: chunk.metadata,
      embedding,
      source_type: chunk.source_type,
      source_id: chunk.source_id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw new Error(`upsertChunk error: ${error.message}`);
}

/**
 * Delete all chunks belonging to a source record (e.g., when a tour is deleted).
 */
export async function deleteChunks(
  sourceType: string,
  sourceId: string
): Promise<void> {
  const { error } = await supabase
    .from("knowledge_chunks")
    .delete()
    .eq("source_type", sourceType)
    .eq("source_id", sourceId);

  if (error) throw new Error(`deleteChunks error: ${error.message}`);
}

/**
 * Search the knowledge base using cosine similarity.
 * Returns top `limit` results above the similarity threshold.
 */
export async function searchSimilar(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  const embedding = await generateEmbedding(query);

  const { data, error } = await supabase.rpc("match_knowledge", {
    query_embedding: embedding,
    match_count: limit,
    min_similarity: 0.25,
  });

  if (error) throw new Error(`searchSimilar error: ${error.message}`);
  return (data as SearchResult[]) ?? [];
}
