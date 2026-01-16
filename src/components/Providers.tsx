'use client'

import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { ReactNode, useEffect, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { api } from '@/lib/api'

interface ProvidersProps {
  children: ReactNode
}

function StoreInitializer({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const { setToken, fetchLists } = useStore()

  // Handle unauthorized (401) responses - sign out user
  const handleUnauthorized = useCallback(() => {
    setToken(null)
    signOut({ callbackUrl: '/login' })
  }, [setToken])

  useEffect(() => {
    // Set up the unauthorized handler
    api.setOnUnauthorized(handleUnauthorized)
  }, [handleUnauthorized])

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      setToken(session.accessToken)
      fetchLists()
    } else if (status === 'unauthenticated') {
      setToken(null)
    }
  }, [session, status, setToken, fetchLists])

  return <>{children}</>
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <StoreInitializer>
        {children}
      </StoreInitializer>
    </SessionProvider>
  )
}
