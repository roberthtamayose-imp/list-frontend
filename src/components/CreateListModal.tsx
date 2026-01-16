'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { X, ShoppingCart, FileText, Sparkles } from 'lucide-react'

interface CreateListModalProps {
  onClose: () => void
}

export function CreateListModal({ onClose }: CreateListModalProps) {
  const router = useRouter()
  const { createList, error, clearError } = useStore()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setIsLoading(true)
    
    const newList = await createList(name, description || undefined)
    
    setIsLoading(false)
    
    if (newList) {
      onClose()
      router.push(`/list/${newList.id}`)
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
              <ShoppingCart className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Nova Lista</h2>
              <p className="text-gray-400 text-sm">Crie uma nova lista de compras</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da lista *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Compras do mês"
                className="input-field pl-12"
                required
              />
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição (opcional)
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição..."
                rows={3}
                className="input-field pl-12 resize-none"
              />
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Templates rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              {['Compras do mês', 'Churrasco', 'Feira da semana', 'Lista de festa'].map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setName(template)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
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
              disabled={!name || isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Criar lista'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
