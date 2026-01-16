# 🛒 ListaCompras

Uma aplicação moderna de lista de compras construída com Next.js, TypeScript e Tailwind CSS. Permite criar, organizar e compartilhar listas de compras com família e amigos.

![ListaCompras Preview](https://via.placeholder.com/800x400?text=ListaCompras+Preview)

## ✨ Funcionalidades

- 🔐 **Autenticação** - Login com Google ou email/senha
- 📝 **Criar Listas** - Crie múltiplas listas de compras
- 🏷️ **Categorias** - Organize itens por categorias (Frutas, Vegetais, Carnes, etc.)
- ✅ **Marcar Itens** - Marque itens como comprados
- 📊 **Progresso Visual** - Acompanhe o progresso das compras
- 🔗 **Compartilhamento** - Compartilhe listas usando códigos de convite
- 👥 **Colaboração** - Edite listas em conjunto com outras pessoas
- 💾 **Persistência Local** - Dados salvos no navegador
- 📱 **Responsivo** - Funciona em desktop e mobile

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:

```bash
cd shopping-list
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui

# Google OAuth (opcional - para login com Google)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

### Gerando o NEXTAUTH_SECRET

Execute no terminal:

```bash
openssl rand -base64 32
```

### Configurando Login com Google (opcional)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs e Serviços" > "Credenciais"
4. Clique em "Criar Credenciais" > "ID do cliente OAuth"
5. Escolha "Aplicativo da Web"
6. Adicione as origens autorizadas:
   - `http://localhost:3000`
7. Adicione os URIs de redirecionamento autorizados:
   - `http://localhost:3000/api/auth/callback/google`
8. Copie o Client ID e Client Secret para o `.env.local`

### Executando

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🎮 Como Usar

### Conta Demo

Para testar rapidamente sem configurar o Google OAuth:

- **Email:** demo@example.com
- **Senha:** demo123

### Criando uma Lista

1. Faça login
2. Clique em "Nova Lista"
3. Dê um nome para sua lista
4. Comece a adicionar itens!

### Compartilhando uma Lista

1. Na sua lista, clique no ícone de compartilhamento
2. Gere um código de compartilhamento
3. Envie o código para quem você deseja compartilhar
4. A pessoa deve:
   - Fazer login na aplicação
   - Clicar em "Entrar em lista"
   - Digitar o código recebido

### Adicionando Itens

- Use os botões de adição rápida para itens comuns
- Ou adicione manualmente com nome, quantidade, unidade e categoria

## 🛠️ Tecnologias

- [Next.js 14](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [NextAuth.js](https://next-auth.js.org/) - Autenticação
- [Zustand](https://zustand-demo.pmnd.rs/) - Gerenciamento de estado
- [Lucide Icons](https://lucide.dev/) - Ícones

## 📁 Estrutura do Projeto

```
shopping-list/
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/  # API de autenticação
│   │   ├── dashboard/               # Página principal
│   │   ├── list/[id]/              # Página da lista individual
│   │   ├── login/                   # Página de login
│   │   ├── join/                    # Página de entrada em lista
│   │   ├── globals.css              # Estilos globais
│   │   ├── layout.tsx               # Layout principal
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── AddItemModal.tsx         # Modal de adicionar item
│   │   ├── CreateListModal.tsx      # Modal de criar lista
│   │   ├── JoinListModal.tsx        # Modal de entrar em lista
│   │   ├── Providers.tsx            # Providers do app
│   │   └── ShareModal.tsx           # Modal de compartilhamento
│   ├── store/
│   │   └── useStore.ts              # Store Zustand
│   └── types/
│       ├── index.ts                 # Tipos TypeScript
│       └── next-auth.d.ts           # Tipos NextAuth
├── tailwind.config.ts               # Configuração Tailwind
├── next.config.js                   # Configuração Next.js
└── package.json
```

## 🎨 Design

A aplicação utiliza um design moderno com:

- **Glass morphism** - Efeitos de vidro fosco
- **Gradientes sutis** - Cores vibrantes e harmoniosas
- **Animações suaves** - Transições e micro-interações
- **Dark theme** - Tema escuro elegante
- **Responsividade** - Adaptável a todos os tamanhos de tela

## 📝 Licença

Este projeto está sob a licença MIT.

---

Feito com ❤️ para simplificar suas compras.


