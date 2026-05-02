'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2, ImageOff, AlertCircle } from 'lucide-react'
import { createMotif, updateMotif, checkKodeExists } from '@/lib/motif-api'
import type { Motif } from '@/types'

interface Props {
  motif: Motif | null
  onClose: () => void
  onSuccess: (motif: Motif, isEdit: boolean) => void
}

export default function MotifFormModal({ motif, onClose, onSuccess }: Props) {
  const isEdit = !!motif
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [kode, setKode] = useState(motif?.kode || '')
  const [namaMotif, setNamaMotif] = useState(motif?.nama_motif || '')
  const [hpp, setHpp] = useState(motif?.hpp?.toString() || '')
  const [stok, setStok] = useState(motif?.stok_datang?.toString() || '')
  const [tanggal, setTanggal] = useState(motif?.tanggal_datang || new Date().toISOString().split('T')[0])
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(motif?.foto_url || null)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [kodeChecking, setKodeChecking] = useState(false)

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (fotoFile && previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [fotoFile, previewUrl])

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, foto: 'File harus berupa gambar (JPG, PNG, WebP)' }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, foto: 'Ukuran foto maksimal 5MB' }))
      return
    }

    setErrors((prev) => { const { foto, ...rest } = prev; return rest })
    setFotoFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!kode.trim()) newErrors.kode = 'Kode motif wajib diisi'
    else if (!/^[A-Za-z0-9-_]+$/.test(kode.trim()))
      newErrors.kode = 'Kode hanya boleh huruf, angka, strip, dan underscore'

    if (!namaMotif.trim()) newErrors.namaMotif = 'Nama motif wajib diisi'

    const hppNum = parseFloat(hpp.replace(/[^0-9]/g, ''))
    if (!hpp) newErrors.hpp = 'HPP wajib diisi'
    else if (isNaN(hppNum) || hppNum <= 0) newErrors.hpp = 'HPP harus lebih dari 0'

    const stokNum = parseInt(stok)
    if (!stok) newErrors.stok = 'Stok datang wajib diisi'
    else if (isNaN(stokNum) || stokNum < 0) newErrors.stok = 'Stok tidak boleh negatif'

    if (!tanggal) newErrors.tanggal = 'Tanggal datang wajib diisi'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      const kodeClean = kode.trim().toUpperCase()

      // Check kode uniqueness
      const exists = await checkKodeExists(kodeClean, motif?.id)
      if (exists) {
        setErrors({ kode: `Kode "${kodeClean}" sudah digunakan motif lain` })
        setLoading(false)
        return
      }

      const hppNum = parseFloat(hpp.replace(/[^0-9]/g, ''))
      const stokNum = parseInt(stok)

      const payload = {
        kode: kodeClean,
        nama_motif: namaMotif.trim(),
        hpp: hppNum,
        stok_datang: stokNum,
        tanggal_datang: tanggal,
        foto_url: motif?.foto_url || null,
      }

      let result: Motif

      if (isEdit && motif) {
        result = await updateMotif(motif.id, payload, fotoFile || undefined, motif.foto_url)
      } else {
        result = await createMotif(payload, fotoFile || undefined)
      }

      onSuccess(result, isEdit)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setErrors({ submit: message })
    } finally {
      setLoading(false)
    }
  }

  // Format HPP input
  function handleHppChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') {
      setHpp('')
      return
    }
    // Format with thousand separator
    const formatted = parseInt(raw).toLocaleString('id-ID')
    setHpp(formatted)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'var(--bg-overlay)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-3xl border overflow-hidden animate-slide-up"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-card-hover)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div>
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Motif' : 'Tambah Motif Baru'}
            </h2>
            <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--text-muted)' }}>
              {isEdit ? `Memperbarui: ${motif.kode}` : 'Isi data motif kain baru'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Foto upload */}
          <div>
            <label className="label">Foto Produk</label>
            <div
              className="relative aspect-square max-w-[200px] mx-auto rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                borderColor: previewUrl ? 'var(--border-focus)' : 'var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-focus)'
              }}
              onMouseLeave={(e) => {
                if (!previewUrl) e.currentTarget.style.borderColor = 'var(--border-primary)'
              }}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                  >
                    <div className="text-white text-center">
                      <Upload size={24} className="mx-auto mb-1" />
                      <span className="text-xs">Ganti Foto</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border-primary)' }}
                  >
                    <Upload size={22} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Klik untuk upload foto
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      JPG, PNG, WebP — maks 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
            {errors.foto && <FieldError message={errors.foto} />}
          </div>

          {/* Kode */}
          <div>
            <label className="label" htmlFor="kode">Kode Motif *</label>
            <input
              id="kode"
              type="text"
              className="input-field font-mono uppercase"
              placeholder="Contoh: MT001"
              value={kode}
              onChange={(e) => setKode(e.target.value.toUpperCase())}
              maxLength={20}
            />
            {errors.kode && <FieldError message={errors.kode} />}
          </div>

          {/* Nama Motif */}
          <div>
            <label className="label" htmlFor="nama">Nama Motif *</label>
            <input
              id="nama"
              type="text"
              className="input-field"
              placeholder="Contoh: Batik Parang Rusak"
              value={namaMotif}
              onChange={(e) => setNamaMotif(e.target.value)}
              maxLength={100}
            />
            {errors.namaMotif && <FieldError message={errors.namaMotif} />}
          </div>

          {/* HPP */}
          <div>
            <label className="label" htmlFor="hpp">HPP (Harga Pokok Produksi) *</label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Rp
              </span>
              <input
                id="hpp"
                type="text"
                className="input-field pl-10 font-mono"
                placeholder="0"
                value={hpp}
                onChange={handleHppChange}
                inputMode="numeric"
              />
            </div>
            {errors.hpp && <FieldError message={errors.hpp} />}
          </div>

          {/* Stok & Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="stok">Stok Datang *</label>
              <input
                id="stok"
                type="number"
                className="input-field"
                placeholder="0"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                min="0"
              />
              {errors.stok && <FieldError message={errors.stok} />}
            </div>

            <div>
              <label className="label" htmlFor="tanggal">Tanggal Datang *</label>
              <input
                id="tanggal"
                type="date"
                className="input-field"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
              {errors.tanggal && <FieldError message={errors.tanggal} />}
            </div>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl text-sm"
              style={{
                backgroundColor: 'rgba(181, 64, 64, 0.1)',
                color: 'var(--accent-danger)',
                border: '1px solid rgba(181, 64, 64, 0.2)',
              }}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? 'Simpan Perubahan' : 'Tambah Motif'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--accent-danger)' }}>
      <AlertCircle size={12} />
      {message}
    </p>
  )
}
