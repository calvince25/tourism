-- Enable the pgvector extension (run this in Supabase SQL Editor)
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge chunks table for RAG
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id          TEXT PRIMARY KEY,
  content     TEXT NOT NULL,
  metadata    JSONB NOT NULL DEFAULT '{}',
  embedding   vector(768),
  source_type TEXT NOT NULL,  -- 'tour' | 'destination' | 'faq' | 'blog'
  source_id   TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Index on source for fast deletes/updates
CREATE INDEX IF NOT EXISTS knowledge_chunks_source_idx
  ON knowledge_chunks (source_type, source_id);

-- Similarity search function (cosine distance)
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding vector(768),
  match_count     INT DEFAULT 5,
  min_similarity  FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id          TEXT,
  content     TEXT,
  metadata    JSONB,
  source_type TEXT,
  source_id   TEXT,
  similarity  FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    kc.id,
    kc.content,
    kc.metadata,
    kc.source_type,
    kc.source_id,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE 1 - (kc.embedding <=> query_embedding) > min_similarity
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$;
