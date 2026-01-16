'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useStore } from '@/store/useStore'

interface ProvidersProps {
  children: ReactNode
}

function StoreInitializer({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const { setToken, fetchLists } = useStore()

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
