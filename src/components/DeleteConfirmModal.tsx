'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import type { Motif } from '@/types'

interface Props {
  motif: Motif
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteConfirmModal({ motif, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'var(--bg-overlay)' }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose() }}
    >
      <div
        className="w-full max-w-sm rounded-3xl border overflow-hidden animate-scale-in"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-card-hover)',
        }}
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
            style={{ backgroundColor: 'rgba(181, 64, 64, 0.12)', color: 'var(--accent-danger)' }}
          >
            <AlertTriangle size={28} />
          </div>

          <h2
            className="font-display text-xl font-bold text-center mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Hapus Motif?
          </h2>
          <p className="text-sm text-center font-body mb-1" style={{ color: 'var(--text-muted)' }}>
            Anda akan menghapus motif berikut secara permanen:
          </p>
          <div
            className="text-center font-mono font-bold text-lg mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {motif.kode}
          </div>
          <div className="text-center text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            {motif.nama_motif}
          </div>

          <div
            className="text-xs text-center p-3 rounded-xl mb-5 font-body"
            style={{
              backgroundColor: 'rgba(181, 64, 64, 0.08)',
              color: 'var(--accent-danger)',
              border: '1px solid rgba(181, 64, 64, 0.15)',
            }}
          >
            ⚠️ Data dan foto motif ini tidak dapat dipulihkan setelah dihapus.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1 justify-center"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="btn-danger flex-1 justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Ya, Hapus
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
