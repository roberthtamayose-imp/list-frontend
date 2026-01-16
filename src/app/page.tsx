'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ShoppingCart, Share2, Users, Check, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  const features = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: 'Listas Inteligentes',
      description: 'Crie e organize suas listas de compras com categorias e quantidades',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Compartilhamento Fácil',
      description: 'Compartilhe listas com família e amigos usando um código simples',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Colaboração em Tempo Real',
      description: 'Edite listas em conjunto e veja atualizações instantaneamente',
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: 'Marque itens comprados',
      description: 'Acompanhe o progresso das compras de forma visual e intuitiva',
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-32">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Lista<span className="gradient-text">Compras</span>
              </span>
            </div>
            
            <Link
              href="/login"
              className="btn-secondary flex items-center gap-2"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Organize suas compras de forma inteligente
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Suas listas de compras{' '}
              <span className="gradient-text">simplificadas</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Crie, organize e compartilhe listas de compras com sua família e amigos.
              Nunca mais esqueça de comprar algo importante.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-primary flex items-center justify-center gap-2 text-lg">
                Começar gratuitamente
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary flex items-center justify-center gap-2 text-lg">
                Ver demonstração
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tudo que você precisa para suas compras
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Funcionalidades pensadas para tornar sua experiência de compras mais fácil e organizada
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 card-hover stagger-item"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-accent-500/10" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Crie sua primeira lista de compras em segundos. É grátis e sempre será.
              </p>
              <Link href="/login" className="btn-primary inline-flex items-center gap-2 text-lg">
                Criar minha primeira lista
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 ListaCompras. Feito com ❤️ para simplificar suas compras.</p>
        </div>
      </footer>
    </main>
  )
}


