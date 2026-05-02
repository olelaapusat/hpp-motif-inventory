import { createClient } from '@/lib/supabase/client'
import type { Motif, MotifInsert, MotifUpdate, SortOption } from '@/types'

const BUCKET_NAME = 'motif-photos'

export async function getMotifs(
  search: string = '',
  sort: SortOption = 'tanggal_desc'
): Promise<Motif[]> {
  const supabase = createClient()

  let query = supabase.from('motifs').select('*')

  // Search filter - search by kode
  if (search.trim()) {
    query = query.ilike('kode', `%${search.trim()}%`)
  }

  // Sorting
  switch (sort) {
    case 'tanggal_desc':
      query = query.order('tanggal_datang', { ascending: false })
      break
    case 'tanggal_asc':
      query = query.order('tanggal_datang', { ascending: true })
      break
    case 'kode_asc':
      query = query.order('kode', { ascending: true })
      break
    case 'kode_desc':
      query = query.order('kode', { ascending: false })
      break
    case 'hpp_asc':
      query = query.order('hpp', { ascending: true })
      break
    case 'hpp_desc':
      query = query.order('hpp', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getMotifById(id: string): Promise<Motif | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('motifs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createMotif(
  motif: MotifInsert,
  fotoFile?: File
): Promise<Motif> {
  const supabase = createClient()

  let foto_url: string | null = null

  // Upload foto jika ada
  if (fotoFile) {
    foto_url = await uploadFoto(fotoFile)
  }

  const { data, error } = await supabase
    .from('motifs')
    .insert({ ...motif, foto_url })
    .select()
    .single()

  if (error) {
    // Rollback foto jika insert gagal
    if (foto_url) await deleteFoto(foto_url)
    throw error
  }

  return data
}

export async function updateMotif(
  id: string,
  motif: MotifUpdate,
  fotoFile?: File,
  oldFotoUrl?: string | null
): Promise<Motif> {
  const supabase = createClient()

  let foto_url = oldFotoUrl

  // Upload foto baru jika ada
  if (fotoFile) {
    foto_url = await uploadFoto(fotoFile)
    // Hapus foto lama setelah berhasil upload foto baru
    if (oldFotoUrl) {
      await deleteFoto(oldFotoUrl).catch(console.error)
    }
  }

  const { data, error } = await supabase
    .from('motifs')
    .update({ ...motif, foto_url, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    // Rollback foto baru jika update gagal
    if (fotoFile && foto_url && foto_url !== oldFotoUrl) {
      await deleteFoto(foto_url).catch(console.error)
    }
    throw error
  }

  return data
}

export async function deleteMotif(id: string, fotoUrl?: string | null): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('motifs').delete().eq('id', id)

  if (error) throw error

  // Hapus foto setelah data berhasil dihapus
  if (fotoUrl) {
    await deleteFoto(fotoUrl).catch(console.error)
  }
}

export async function checkKodeExists(kode: string, excludeId?: string): Promise<boolean> {
  const supabase = createClient()

  let query = supabase.from('motifs').select('id').eq('kode', kode)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query
  return (data?.length ?? 0) > 0
}

// Storage functions
async function uploadFoto(file: File): Promise<string> {
  const supabase = createClient()

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)
  return data.publicUrl
}

async function deleteFoto(url: string): Promise<void> {
  const supabase = createClient()

  // Extract file path from URL
  const urlParts = url.split(`/${BUCKET_NAME}/`)
  if (urlParts.length < 2) return

  const filePath = urlParts[1]
  await supabase.storage.from(BUCKET_NAME).remove([filePath])
}
