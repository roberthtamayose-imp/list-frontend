'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { X, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react'

interface JoinListModalProps {
  onClose: () => void
}

export function JoinListModal({ onClose }: JoinListModalProps) {
  const router = useRouter()
  const { joinListByCode, error, clearError } = useStore()
  
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return
    
    clearError()
    setIsLoading(true)
    
    const list = await joinListByCode(code.toUpperCase())
    
    setIsLoading(false)
    
    if (list) {
      setStatus('success')
      setTimeout(() => {
        onClose()
        router.push(`/list/${list.id}`)
      }, 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Entrar em lista</h2>
              <p className="text-gray-400 text-sm">Use um código de convite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código de convite
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                maxLength={6}
                className="input-field text-center text-2xl tracking-widest uppercase"
                required
              />
              <p className="text-gray-500 text-sm mt-2 text-center">
                Peça o código para quem criou a lista
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={code.length < 6 || isLoading}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {status === 'success' && (
          <div className="text-center py-8 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Você entrou na lista!
            </h3>
            <p className="text-gray-400">
              Redirecionando para a lista...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Código inválido
            </h3>
            <p className="text-gray-400 mb-6">
              {error || 'Verifique o código e tente novamente'}
            </p>
            <button
              onClick={() => {
                setStatus('idle')
                setCode('')
                clearError()
              }}
              className="btn-secondary"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
