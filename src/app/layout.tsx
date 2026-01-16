import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ListaCompras - Organize suas compras',
  description: 'Crie, organize e compartilhe suas listas de compras de forma fácil e intuitiva',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        <Providers>
          <div className="animated-bg" />
          {children}
        </Providers>
      </body>
    </html>
  )
}


