'use client'

import Image from 'next/image'
import { X, Edit2, Trash2, ImageOff, Calendar, Package, Tag, Banknote } from 'lucide-react'
import { formatRupiah, formatTanggal } from '@/lib/utils'
import type { Motif } from '@/types'

interface Props {
  motif: Motif
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function MotifDetailModal({ motif, onClose, onEdit, onDelete }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'var(--bg-overlay)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-3xl border overflow-hidden animate-scale-in"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-card-hover)',
        }}
      >
        {/* Photo */}
        <div
          className="relative aspect-square"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          {motif.foto_url ? (
            <Image
              src={motif.foto_url}
              alt={`${motif.kode} - ${motif.nama_motif}`}
              fill
              className="object-cover"
              sizes="448px"
              priority
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <ImageOff size={48} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
                Belum ada foto
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all text-white"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <X size={18} />
          </button>

          {/* Kode badge overlay */}
          <div className="absolute bottom-3 left-3">
            <span
              className="font-mono font-bold text-lg text-white px-4 py-2 rounded-xl"
              style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            >
              {motif.kode}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {motif.nama_motif}
          </h2>
          <div
            className="text-2xl font-bold font-mono mb-5"
            style={{ color: 'var(--accent-primary)' }}
          >
            {formatRupiah(motif.hpp)}
          </div>

          {/* Detail grid */}
          <div
            className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-2xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <DetailItem
              icon={<Tag size={15} />}
              label="Kode"
              value={<span className="font-mono font-bold">{motif.kode}</span>}
            />
            <DetailItem
              icon={<Package size={15} />}
              label="Stok Datang"
              value={<span className="font-mono font-bold">{motif.stok_datang} pcs</span>}
            />
            <DetailItem
              icon={<Banknote size={15} />}
              label="HPP"
              value={<span className="font-mono">{formatRupiah(motif.hpp)}</span>}
            />
            <DetailItem
              icon={<Calendar size={15} />}
              label="Tanggal Datang"
              value={formatTanggal(motif.tanggal_datang)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onDelete}
              className="btn-secondary flex-none px-4"
              style={{ color: 'var(--accent-danger)', borderColor: 'rgba(181, 64, 64, 0.3)' }}
            >
              <Trash2 size={16} />
            </button>
            <button onClick={onEdit} className="btn-primary flex-1 justify-center">
              <Edit2 size={16} />
              Edit Motif
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-muted)' }}>
        {icon}
        <span className="text-xs font-body uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-body" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  )
}
