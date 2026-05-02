'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Search, SlidersHorizontal, X, RefreshCw, Package } from 'lucide-react'
import { getMotifs, deleteMotif } from '@/lib/motif-api'
import type { Motif, SortOption } from '@/types'
import MotifCard from '@/components/MotifCard'
import MotifFormModal from '@/components/MotifFormModal'
import MotifDetailModal from '@/components/MotifDetailModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import Toast from '@/components/Toast'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'tanggal_desc', label: 'Terbaru Dulu' },
  { value: 'tanggal_asc', label: 'Terlama Dulu' },
  { value: 'kode_asc', label: 'Kode A → Z' },
  { value: 'kode_desc', label: 'Kode Z → A' },
  { value: 'hpp_asc', label: 'HPP Terendah' },
  { value: 'hpp_desc', label: 'HPP Tertinggi' },
]

export default function MotifDashboard() {
  const [motifs, setMotifs] = useState<Motif[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('tanggal_desc')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Modals
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingMotif, setEditingMotif] = useState<Motif | null>(null)
  const [viewingMotif, setViewingMotif] = useState<Motif | null>(null)
  const [deletingMotif, setDeletingMotif] = useState<Motif | null>(null)

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchMotifs = useCallback(async (q: string, s: SortOption) => {
    setLoading(true)
    try {
      const data = await getMotifs(q, s)
      setMotifs(data)
    } catch (err) {
      console.error(err)
      showToast('error', 'Gagal memuat data. Coba refresh halaman.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchMotifs('', 'tanggal_desc')
  }, [fetchMotifs])

  // Debounced search
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      fetchMotifs(search, sort)
    }, 300)
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current)
    }
  }, [search, sort, fetchMotifs])

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleDelete(motif: Motif) {
    try {
      await deleteMotif(motif.id, motif.foto_url)
      setMotifs((prev) => prev.filter((m) => m.id !== motif.id))
      showToast('success', `Motif "${motif.kode}" berhasil dihapus`)
      setDeletingMotif(null)
    } catch {
      showToast('error', 'Gagal menghapus motif. Coba lagi.')
    }
  }

  function handleFormSuccess(motif: Motif, isEdit: boolean) {
    if (isEdit) {
      setMotifs((prev) => prev.map((m) => (m.id === motif.id ? motif : m)))
      showToast('success', `Motif "${motif.kode}" berhasil diperbarui`)
    } else {
      setMotifs((prev) => [motif, ...prev])
      showToast('success', `Motif "${motif.kode}" berhasil ditambahkan`)
    }
    setShowFormModal(false)
    setEditingMotif(null)
  }

  function handleEdit(motif: Motif) {
    setViewingMotif(null)
    setEditingMotif(motif)
    setShowFormModal(true)
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Inventori Motif
            </h1>
            <p className="text-sm mt-1 font-body" style={{ color: 'var(--text-muted)' }}>
              {loading ? 'Memuat...' : `${motifs.length} motif ditemukan`}
            </p>
          </div>
          <button
            onClick={() => { setEditingMotif(null); setShowFormModal(true) }}
            className="btn-primary"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tambah Motif</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {/* Search and sort bar */}
        <div className="flex gap-2.5 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="input-field pl-10 pr-10"
              placeholder="Cari kode motif... (contoh: MT001, 001)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="btn-secondary whitespace-nowrap"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">{currentSortLabel}</span>
            </button>

            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl border overflow-hidden z-50 animate-scale-in"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-primary)',
                    boxShadow: 'var(--shadow-card-hover)',
                  }}
                >
                  <div className="p-1.5">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSort(option.value); setShowSortMenu(false) }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-body transition-colors"
                        style={{
                          color: sort === option.value ? 'var(--accent-primary)' : 'var(--text-primary)',
                          backgroundColor: sort === option.value ? 'rgba(45, 78, 138, 0.08)' : 'transparent',
                          fontWeight: sort === option.value ? '600' : '400',
                        }}
                        onMouseEnter={(e) => {
                          if (sort !== option.value)
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                        }}
                        onMouseLeave={(e) => {
                          if (sort !== option.value)
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchMotifs(search, sort)}
            className="btn-secondary p-2.5"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MotifCardSkeleton key={i} />
          ))}
        </div>
      ) : motifs.length === 0 ? (
        <EmptyState search={search} onAdd={() => setShowFormModal(true)} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {motifs.map((motif, idx) => (
            <MotifCard
              key={motif.id}
              motif={motif}
              style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
              onClick={() => setViewingMotif(motif)}
              onEdit={() => handleEdit(motif)}
              onDelete={() => setDeletingMotif(motif)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showFormModal && (
        <MotifFormModal
          motif={editingMotif}
          onClose={() => { setShowFormModal(false); setEditingMotif(null) }}
          onSuccess={handleFormSuccess}
        />
      )}

      {viewingMotif && (
        <MotifDetailModal
          motif={viewingMotif}
          onClose={() => setViewingMotif(null)}
          onEdit={() => handleEdit(viewingMotif)}
          onDelete={() => { setViewingMotif(null); setDeletingMotif(viewingMotif) }}
        />
      )}

      {deletingMotif && (
        <DeleteConfirmModal
          motif={deletingMotif}
          onClose={() => setDeletingMotif(null)}
          onConfirm={() => handleDelete(deletingMotif)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

function MotifCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square" style={{ backgroundColor: 'var(--bg-secondary)' }} />
      <div className="p-3 space-y-2">
        <div className="h-4 rounded-lg w-2/3" style={{ backgroundColor: 'var(--bg-secondary)' }} />
        <div className="h-3 rounded-lg w-full" style={{ backgroundColor: 'var(--bg-secondary)' }} />
        <div className="h-3 rounded-lg w-3/4" style={{ backgroundColor: 'var(--bg-secondary)' }} />
      </div>
    </div>
  )
}

function EmptyState({ search, onAdd }: { search: string; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
      >
        <Package size={32} />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {search ? `Tidak ditemukan: "${search}"` : 'Belum ada motif'}
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
        {search
          ? 'Coba kata kunci berbeda atau hapus filter pencarian.'
          : 'Mulai tambahkan motif kain pertama Anda ke dalam inventori.'}
      </p>
      {!search && (
        <button onClick={onAdd} className="btn-primary">
          <Plus size={18} />
          Tambah Motif Pertama
        </button>
      )}
    </div>
  )
}
