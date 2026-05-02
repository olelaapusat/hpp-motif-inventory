'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, Layers } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email atau password salah. Silakan coba lagi.'
          : error.message
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Left Panel - Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255,255,255,0.15) 20px,
                rgba(255,255,255,0.15) 40px
              )`
            }}
          />
        </div>
        <div className="absolute top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        />
        <div className="absolute -bottom-24 -left-12 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Layers size={22} className="text-white" />
          </div>
          <span className="font-display text-white text-xl font-semibold tracking-wide">
            HPP Motif
          </span>
        </div>

        {/* Center text */}
        <div className="relative z-10">
          <h1 className="font-display text-white text-5xl font-bold leading-tight mb-6">
            Kelola Inventori<br />
            <span className="opacity-75">Motif Kain</span><br />
            dengan Mudah
          </h1>
          <p className="text-white/70 text-lg font-body leading-relaxed max-w-sm">
            Sistem manajemen HPP & stok motif tekstil yang elegan, cepat, dan terpercaya untuk bisnis Anda.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { label: 'Motif Tersimpan', value: '500+' },
            { label: 'Data Real-time', value: '100%' },
            { label: 'Always Secure', value: '🔒' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-white text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-white/60 text-xs font-body mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Layers size={22} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              HPP Motif Inventory
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Selamat Datang
            </h2>
            <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
              Masuk ke akun tim Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="p-3.5 rounded-xl text-sm font-body animate-fade-in"
                style={{
                  backgroundColor: 'rgba(181, 64, 64, 0.1)',
                  color: 'var(--accent-danger)',
                  border: '1px solid rgba(181, 64, 64, 0.2)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-8 font-body" style={{ color: 'var(--text-muted)' }}>
            Akses hanya untuk anggota tim yang telah terdaftar.
          </p>
        </div>
      </div>
    </div>
  )
}
