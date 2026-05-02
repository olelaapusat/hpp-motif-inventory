'use client'

import Image from 'next/image'
import { Edit2, Trash2, ImageOff } from 'lucide-react'
import { formatRupiah, formatTanggal } from '@/lib/utils'
import type { Motif } from '@/types'

interface Props {
  motif: Motif
  style?: React.CSSProperties
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function MotifCard({ motif, style, onClick, onEdit, onDelete }: Props) {
  return (
    <div
      className="card overflow-hidden cursor-pointer group animate-slide-up"
      style={style}
      onClick={onClick}
    >
      {/* Photo */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {motif.foto_url ? (
          <Image
            src={motif.foto_url}
            alt={`${motif.kode} - ${motif.nama_motif}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff size={28} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
              No Photo
            </span>
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-end p-2 gap-1.5"
          style={{ background: 'linear-gradient(to top, rgba(14,31,61,0.6) 0%, transparent 60%)' }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all duration-150 active:scale-95"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all duration-150 active:scale-95"
            style={{ backgroundColor: 'var(--accent-danger)' }}
            title="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Kode badge */}
        <div className="absolute top-2 left-2">
          <span
            className="badge text-white font-mono text-xs"
            style={{ backgroundColor: 'rgba(14, 31, 61, 0.75)', backdropFilter: 'blur(4px)' }}
          >
            {motif.kode}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        {/* Kode (large, bold) */}
        <div>
          <div className="font-mono font-bold text-base leading-none" style={{ color: 'var(--text-primary)' }}>
            {motif.kode}
          </div>
          <div className="text-xs mt-1 truncate font-body" style={{ color: 'var(--text-secondary)' }}>
            {motif.nama_motif}
          </div>
        </div>

        {/* HPP */}
        <div
          className="text-sm font-bold font-mono"
          style={{ color: 'var(--accent-primary)' }}
        >
          {formatRupiah(motif.hpp)}
        </div>

        {/* Stok & Tanggal */}
        <div
          className="flex items-center justify-between text-xs font-body border-t pt-2"
          style={{ borderColor: 'var(--border-secondary)', color: 'var(--text-muted)' }}
        >
          <span>Stok: <strong style={{ color: 'var(--text-primary)' }}>{motif.stok_datang}</strong></span>
          <span>{formatTanggal(motif.tanggal_datang)}</span>
        </div>
      </div>
    </div>
  )
}
