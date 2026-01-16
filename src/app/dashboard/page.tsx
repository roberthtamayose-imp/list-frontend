'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { 
  ShoppingCart, Plus, LogOut, User,
  ChevronRight, Trash2, Share2, Users,
  Search, Calendar, Package
} from 'lucide-react'
import { CreateListModal } from '@/components/CreateListModal'
import { ShareModal } from '@/components/ShareModal'
import { JoinListModal } from '@/components/JoinListModal'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { lists, deleteList, isLoading, error } = useStore()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando suas listas...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleShare = (listId: string) => {
    setSelectedListId(listId)
    setShowShareModal(true)
  }

  const handleDelete = async (listId: string) => {
    if (confirm('Tem certeza que deseja excluir esta lista?')) {
      await deleteList(listId)
    }
  }

  const getCompletionPercentage = (items: { completed: boolean }[]) => {
    if (items.length === 0) return 0
    const completed = items.filter(item => item.completed).length
    return Math.round((completed / items.length) * 100)
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Lista<span className="gradient-text">Compras</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Entrar em lista</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-400" />
                  </div>
                )}
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-xl p-2 z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-medium truncate">
                        {session.user.name}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {session.user.name?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-400">
            Gerencie suas listas de compras e compartilhe com quem quiser
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{lists.length}</p>
                <p className="text-gray-400 text-sm">Listas</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {lists.reduce((acc, list) => acc + list.items.length, 0)}
                </p>
                <p className="text-gray-400 text-sm">Itens</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {lists.filter(list => list.sharedWith.length > 0).length}
                </p>
                <p className="text-gray-400 text-sm">Compartilhadas</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {lists.reduce((acc, list) => 
                    acc + list.items.filter(item => item.completed).length, 0
                  )}
                </p>
                <p className="text-gray-400 text-sm">Comprados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar listas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Lista
          </button>
        </div>

        {/* Lists Grid */}
        {filteredLists.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'Nenhuma lista encontrada' : 'Nenhuma lista ainda'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Tente buscar por outro termo'
                : 'Crie sua primeira lista de compras para começar'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar primeira lista
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLists.map((list, index) => {
              const completion = getCompletionPercentage(list.items)
              const isOwner = list.ownerId === session.user.id
              
              return (
                <div
                  key={list.id}
                  className="glass-card rounded-2xl p-5 card-hover stagger-item group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {list.name}
                      </h3>
                      {list.description && (
                        <p className="text-gray-400 text-sm truncate">
                          {list.description}
                        </p>
                      )}
                    </div>
                    
                    {!isOwner && (
                      <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                        Compartilhada
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {list.items.filter(i => i.completed).length} de {list.items.length} itens
                      </span>
                      <span className="text-primary-400 font-medium">{completion}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>

                  {/* Shared Users */}
                  {list.sharedWith.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">
                        {list.sharedWith.length} pessoa{list.sharedWith.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isOwner && (
                        <>
                          <button
                            onClick={() => handleShare(list.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-primary-400 transition-colors"
                            title="Compartilhar"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(list.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    <Link
                      href={`/list/${list.id}`}
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors"
                    >
                      Ver lista
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateListModal onClose={() => setShowCreateModal(false)} />
      )}
      
      {showShareModal && selectedListId && (
        <ShareModal
          listId={selectedListId}
          onClose={() => {
            setShowShareModal(false)
            setSelectedListId(null)
          }}
        />
      )}

      {showJoinModal && (
        <JoinListModal onClose={() => setShowJoinModal(false)} />
      )}
    </main>
  )
}
