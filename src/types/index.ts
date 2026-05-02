export interface Motif {
  id: string
  kode: string
  nama_motif: string
  hpp: number
  stok_datang: number
  tanggal_datang: string
  foto_url: string | null
  created_at: string
  updated_at: string
}

export type MotifInsert = Omit<Motif, 'id' | 'created_at' | 'updated_at'>
export type MotifUpdate = Partial<MotifInsert>

export type SortOption = 'tanggal_desc' | 'tanggal_asc' | 'kode_asc' | 'kode_desc' | 'hpp_asc' | 'hpp_desc'

export interface FilterState {
  search: string
  sort: SortOption
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info'
  message: string
}
