'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { ShoppingCart, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function JoinPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  const { joinListByCode, error } = useStore()
  const [joinStatus, setJoinStatus] = useState<'loading' | 'success' | 'error' | 'no-code'>('loading')
  const [joinedListId, setJoinedListId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      if (!code) {
        setJoinStatus('no-code')
        return
      }

      const attemptJoin = async () => {
        const list = await joinListByCode(code.toUpperCase())
        
        if (list) {
          setJoinedListId(list.id)
          setJoinStatus('success')
        } else {
          setJoinStatus('error')
        }
      }

      attemptJoin()
    }
  }, [status, session, code, joinListByCode, router])

  if (status === 'loading' || joinStatus === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Entrando na lista...
          </h1>
          <p className="text-gray-400">
            Aguarde um momento
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 text-center animate-scale-in">
        {joinStatus === 'success' && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Você entrou na lista!
            </h1>
            <p className="text-gray-400 mb-8">
              Agora você pode ver e editar os itens desta lista compartilhada.
            </p>
            <div className="flex gap-3 justify-center">
              {joinedListId && (
                <Link href={`/list/${joinedListId}`} className="btn-primary inline-block">
                  Ver lista
                </Link>
              )}
              <Link href="/dashboard" className="btn-secondary inline-block">
                Ir para o dashboard
              </Link>
            </div>
          </>
        )}

        {joinStatus === 'error' && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Código inválido
            </h1>
            <p className="text-gray-400 mb-4">
              {error || 'Este código não existe ou você já está nesta lista.'}
            </p>
            <Link href="/dashboard" className="btn-primary inline-block">
              Ir para o dashboard
            </Link>
          </>
        )}

        {joinStatus === 'no-code' && (
          <>
            <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Nenhum código fornecido
            </h1>
            <p className="text-gray-400 mb-8">
              Para entrar em uma lista, você precisa de um código de convite.
            </p>
            <Link href="/dashboard" className="btn-primary inline-block">
              Ir para o dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Carregando...
          </h1>
        </div>
      </main>
    }>
      <JoinPageContent />
    </Suspense>
  )
}
