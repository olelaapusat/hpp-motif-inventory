'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Layers, Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Props {
  user: SupabaseUser
}

export default function DashboardNavbar({ user }: Props) {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored === 'dark' || (!stored && prefersDark)
    setIsDark(dark)
    if (dark) document.documentElement.classList.add('dark')
  }, [])

  function toggleDark() {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const userEmail = user.email || ''
  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-primary)',
        boxShadow: 'var(--shadow-card)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Layers size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-base leading-none" style={{ color: 'var(--text-primary)' }}>
                HPP Motif
              </div>
              <div className="text-xs font-body leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Inventory System
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl transition-all duration-200"
              style={{
                color: 'var(--text-muted)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono"
                  style={{ backgroundColor: 'var(--accent-secondary)' }}
                >
                  {userInitial}
                </div>
                <span className="hidden sm:block text-sm font-body max-w-[140px] truncate">
                  {userEmail}
                </span>
                <ChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border overflow-hidden z-50 animate-scale-in"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-primary)',
                      boxShadow: 'var(--shadow-card-hover)',
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: 'var(--border-primary)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold font-mono"
                          style={{ backgroundColor: 'var(--accent-secondary)' }}
                        >
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {userEmail}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Anggota Tim
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-colors text-left"
                        style={{ color: 'var(--accent-danger)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(181, 64, 64, 0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <LogOut size={16} />
                        {loggingOut ? 'Keluar...' : 'Keluar'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
