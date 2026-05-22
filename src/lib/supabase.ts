import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

// Public client (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin/server client with elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

export const STORAGE_BUCKET = 'media'

/**
 * Upload a buffer to Supabase Storage and return the public URL.
 */
export async function uploadToStorage(
  buffer: Buffer,
  storagePath: string,
  contentType: string = 'image/webp'
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`)
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath)

  return urlData.publicUrl
}

/**
 * Delete a file from Supabase Storage given its public URL.
 */
export async function deleteFromStorage(publicUrl: string): Promise<void> {
  try {
    // Extract path from full public URL
    // URL format: https://[ref].supabase.co/storage/v1/object/public/media/[path]
    const marker = `/object/public/${STORAGE_BUCKET}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return

    const storagePath = publicUrl.substring(idx + marker.length)
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath])

    if (error) {
      console.warn(`Failed to delete storage file ${storagePath}:`, error.message)
    }
  } catch (err) {
    console.warn('deleteFromStorage error:', err)
  }
}

/**
 * Ensure the media storage bucket exists and is public.
 * Safe to call multiple times (idempotent).
 */
export async function ensureMediaBucket(): Promise<void> {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET)

  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 20971520, // 20MB
    })
    if (error && !error.message.includes('already exists')) {
      console.error('Failed to create media bucket:', error.message)
    } else {
      console.log(`✅ Supabase Storage bucket "${STORAGE_BUCKET}" created.`)
    }
  }
}
