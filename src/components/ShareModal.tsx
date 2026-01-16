'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { X, Share2, Copy, Check, Users, Trash2, Link2 } from 'lucide-react'

interface ShareModalProps {
  listId: string
  onClose: () => void
}

export function ShareModal({ listId, onClose }: ShareModalProps) {
  const { lists, generateShareCode, removeSharedUser, error } = useStore()
  const list = lists.find(l => l.id === listId)
  
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!list) return null

  const handleGenerateCode = async () => {
    setIsGenerating(true)
    await generateShareCode(listId)
    setIsGenerating(false)
  }

  const handleCopyCode = async () => {
    if (list.shareCode) {
      await navigator.clipboard.writeText(list.shareCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    if (list.shareCode) {
      const link = `${window.location.origin}/join?code=${list.shareCode}`
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRemoveUser = async (userId: string) => {
    if (confirm('Remover esta pessoa da lista?')) {
      await removeSharedUser(listId, userId)
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
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Compartilhar</h2>
              <p className="text-gray-400 text-sm">{list.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Share Code Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Código de compartilhamento
          </label>
          
          {list.shareCode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-primary-400 tracking-widest text-center">
                    {list.shareCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 transition-colors"
                  title="Copiar código"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Copiar link de convite
              </button>

              <p className="text-gray-500 text-sm text-center">
                Compartilhe este código com quem você deseja adicionar à lista
              </p>
            </div>
          ) : (
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Gerar código de compartilhamento'
              )}
            </button>
          )}
        </div>

        {/* Shared Users */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-300">
              Pessoas com acesso ({list.sharedWith.length})
            </label>
          </div>

          {list.sharedWith.length === 0 ? (
            <div className="text-center py-6 bg-white/5 rounded-xl">
              <p className="text-gray-400 text-sm">
                Ninguém foi adicionado ainda
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {list.sharedWith.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-primary-400 font-medium">
                        {(user.name || user.email)[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {user.name || 'Usuário'}
                      </p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full btn-secondary mt-6"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
