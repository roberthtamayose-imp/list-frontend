'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { CATEGORIES, Category } from '@/types'
import { 
  ArrowLeft, Plus, Trash2, Edit2, Check, X, 
  ShoppingCart, Users, Share2,
  Search, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { AddItemModal } from '@/components/AddItemModal'
import { ShareModal } from '@/components/ShareModal'

export default function ListPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string
  
  const { lists, fetchList, toggleItem, deleteItem, updateList, isLoading, error } = useStore()
  const list = lists.find(l => l.id === listId)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [showCompleted, setShowCompleted] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Fetch list if not in store
  useEffect(() => {
    const loadList = async () => {
      if (status === 'authenticated' && !list) {
        await fetchList(listId)
      }
      setInitialLoading(false)
    }
    loadList()
  }, [status, listId, list, fetchList])

  useEffect(() => {
    if (list) {
      setNewName(list.name)
    }
  }, [list])

  if (status === 'loading' || initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando lista...</p>
        </div>
      </div>
    )
  }

  if (!session || !list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lista não encontrada</h1>
          {error && (
            <p className="text-red-400 mb-4">{error}</p>
          )}
          <Link href="/dashboard" className="btn-primary">
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = list.ownerId === session.user.id

  // Filter items
  let filteredItems = list.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesCompleted = showCompleted || !item.completed
    return matchesSearch && matchesCategory && matchesCompleted
  })

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category as Category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<Category, typeof filteredItems>)

  const handleSaveName = async () => {
    if (newName.trim()) {
      await updateList(listId, { name: newName.trim() })
    }
    setEditingName(false)
  }

  const handleToggleItem = async (itemId: string) => {
    await toggleItem(listId, itemId)
  }

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Remover este item?')) {
      await deleteItem(listId, itemId)
    }
  }

  const completedCount = list.items.filter(i => i.completed).length
  const totalCount = list.items.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-field py-2 text-lg font-semibold"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') setEditingName(false)
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white truncate">
                    {list.name}
                  </h1>
                  {isOwner && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              
              {list.sharedWith.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Compartilhada com {list.sharedWith.length} pessoa{list.sharedWith.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {isOwner && (
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Progress */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Progresso</h2>
              <p className="text-gray-400 text-sm">
                {completedCount} de {totalCount} itens comprados
              </p>
            </div>
            <div className="text-3xl font-bold gradient-text">
              {completionPercentage}%
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="all">Todas categorias</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`btn-secondary whitespace-nowrap ${!showCompleted ? 'bg-primary-500/20 border-primary-500/30' : ''}`}
          >
            {showCompleted ? 'Ocultar comprados' : 'Mostrar comprados'}
          </button>
        </div>

        {/* Items List */}
        {Object.keys(groupedItems).length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {list.items.length === 0 ? 'Lista vazia' : 'Nenhum item encontrado'}
            </h3>
            <p className="text-gray-400 mb-6">
              {list.items.length === 0 
                ? 'Adicione itens à sua lista de compras'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
            {list.items.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar primeiro item
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.filter(cat => groupedItems[cat.value]).map((category) => (
              <div key={category.value} className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-4 bg-white/5 border-b border-white/5">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">{category.emoji}</span>
                    {category.label}
                    <span className="ml-auto text-sm text-gray-400 font-normal">
                      {groupedItems[category.value].length} {groupedItems[category.value].length === 1 ? 'item' : 'itens'}
                    </span>
                  </h3>
                </div>
                
                <div className="divide-y divide-white/5">
                  {groupedItems[category.value].map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-4 transition-all duration-300 stagger-item group ${
                        item.completed ? 'bg-primary-500/5' : 'hover:bg-white/5'
                      }`}
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className={`checkbox-custom ${item.completed ? 'checked' : ''}`}
                      >
                        {item.completed && <Check className="w-4 h-4 text-white" />}
                      </button>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium transition-all duration-300 ${
                          item.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-white'
                        }`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal listId={listId} onClose={() => setShowAddModal(false)} />
      )}

      {showShareModal && (
        <ShareModal listId={listId} onClose={() => setShowShareModal(false)} />
      )}
    </main>
  )
}
