'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { CATEGORIES, UNITS, Category } from '@/types'
import { X, Plus, Package, Hash, Ruler, Tag, ChevronDown } from 'lucide-react'

interface AddItemModalProps {
  listId: string
  onClose: () => void
}

export function AddItemModal({ listId, onClose }: AddItemModalProps) {
  const { addItem, error, clearError } = useStore()
  
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('un')
  const [category, setCategory] = useState<Category>('outros')
  const [isLoading, setIsLoading] = useState(false)

  // Quick add items
  const quickItems = [
    { name: 'Arroz', category: 'outros' as Category, unit: 'kg' },
    { name: 'Feijão', category: 'outros' as Category, unit: 'kg' },
    { name: 'Leite', category: 'laticinios' as Category, unit: 'L' },
    { name: 'Pão', category: 'padaria' as Category, unit: 'un' },
    { name: 'Ovos', category: 'laticinios' as Category, unit: 'dz' },
    { name: 'Banana', category: 'frutas' as Category, unit: 'kg' },
    { name: 'Tomate', category: 'vegetais' as Category, unit: 'kg' },
    { name: 'Frango', category: 'carnes' as Category, unit: 'kg' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    
    clearError()
    setIsLoading(true)
    
    const newItem = await addItem(listId, {
      name,
      quantity,
      unit,
      category,
      completed: false,
    })
    
    setIsLoading(false)
    
    if (newItem) {
      // Reset form for adding more items
      setName('')
      setQuantity(1)
    }
  }

  const handleQuickAdd = async (item: typeof quickItems[0]) => {
    await addItem(listId, {
      name: item.name,
      quantity: 1,
      unit: item.unit,
      category: item.category,
      completed: false,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full sm:max-w-md glass-card rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Adicionar Item</h2>
              <p className="text-gray-400 text-sm">Adicione itens à sua lista</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Adicionar rapidamente
          </label>
          <div className="flex flex-wrap gap-2">
            {quickItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleQuickAdd(item)}
                className="px-3 py-1.5 bg-white/5 hover:bg-primary-500/20 border border-white/10 hover:border-primary-500/30 rounded-lg text-sm text-gray-300 hover:text-primary-300 transition-all duration-200"
              >
                {CATEGORIES.find(c => c.value === item.category)?.emoji} {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-dark-900 text-gray-500">ou adicione manualmente</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do item *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Arroz, Feijão, Leite..."
                className="input-field pl-12"
                required
              />
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantidade
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={0.01}
                  step={0.01}
                  className="input-field pl-12"
                />
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unidade
              </label>
              <div className="relative">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="input-field pl-12 appearance-none cursor-pointer"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Fechar
            </button>
            <button
              type="submit"
              disabled={!name || isLoading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Adicionar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
