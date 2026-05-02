'use client'

import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

interface Props {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

export default function Toast({ type, message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: type === 'success' ? 'rgba(92, 125, 84, 0.3)' : 'rgba(181, 64, 64, 0.3)',
          boxShadow: 'var(--shadow-card-hover)',
        }}
      >
        <div style={{ color: type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-danger)' }}>
          {type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        </div>
        <span className="text-sm font-body flex-1" style={{ color: 'var(--text-primary)' }}>
          {message}
        </span>
        <button
          onClick={onClose}
          className="p-0.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
