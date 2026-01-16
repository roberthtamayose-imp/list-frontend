const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://list-backend-sjkn.onrender.com/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  unauthorized?: boolean
}

class ApiClient {
  private token: string | null = null
  private onUnauthorized: (() => void) | null = null

  setToken(token: string | null) {
    this.token = token
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        // Handle 401 - token expired or invalid
        if (response.status === 401) {
          if (this.onUnauthorized) {
            this.onUnauthorized()
          }
          return { error: 'Sessão expirada. Faça login novamente.', unauthorized: true }
        }
        
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.message || `Erro ${response.status}` }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API Error:', error)
      return { error: 'Erro de conexão com o servidor' }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: User; access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ user: User; access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async getMe() {
    return this.request<User>('/auth/me')
  }

  // Lists endpoints
  async getLists() {
    return this.request<ShoppingList[]>('/lists')
  }

  async getList(id: string) {
    return this.request<ShoppingList>(`/lists/${id}`)
  }

  async createList(name: string, description?: string) {
    return this.request<ShoppingList>('/lists', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    })
  }

  async updateList(id: string, updates: { name?: string; description?: string }) {
    return this.request<ShoppingList>(`/lists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteList(id: string) {
    return this.request<void>(`/lists/${id}`, {
      method: 'DELETE',
    })
  }

  async generateShareCode(listId: string) {
    return this.request<{ shareCode: string }>(`/lists/${listId}/share-code`, {
      method: 'POST',
    })
  }

  async joinListByCode(code: string) {
    return this.request<ShoppingList>('/lists/join', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async shareWithUser(listId: string, email: string, canEdit: boolean = true) {
    return this.request<ShoppingList>(`/lists/${listId}/share`, {
      method: 'POST',
      body: JSON.stringify({ email, canEdit }),
    })
  }

  async removeShare(listId: string, userId: string) {
    return this.request<void>(`/lists/${listId}/share/${userId}`, {
      method: 'DELETE',
    })
  }

  // Items endpoints
  async getItems(listId: string) {
    return this.request<ShoppingItem[]>(`/lists/${listId}/items`)
  }

  async createItem(listId: string, item: CreateItemData) {
    return this.request<ShoppingItem>(`/lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    })
  }

  async updateItem(listId: string, itemId: string, updates: Partial<CreateItemData>) {
    return this.request<ShoppingItem>(`/lists/${listId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async toggleItem(listId: string, itemId: string) {
    return this.request<ShoppingItem>(`/lists/${listId}/items/${itemId}/toggle`, {
      method: 'PATCH',
    })
  }

  async deleteItem(listId: string, itemId: string) {
    return this.request<void>(`/lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCompleted(listId: string) {
    return this.request<void>(`/lists/${listId}/items`, {
      method: 'DELETE',
    })
  }
}

// Types
export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  completed: boolean
  createdAt: string
  addedBy?: {
    id: string
    name: string | null
    email: string
  }
}

export interface SharedUser {
  id: string
  email: string
  name: string | null
  canEdit: boolean
}

export interface ShoppingList {
  id: string
  name: string
  description: string | null
  shareCode: string | null
  ownerId: string
  owner: {
    id: string
    name: string | null
    email: string
  }
  items: ShoppingItem[]
  sharedWith: SharedUser[]
  createdAt: string
  updatedAt: string
}

export interface CreateItemData {
  name: string
  quantity?: number
  unit?: string
  category?: string
  completed?: boolean
}

export const api = new ApiClient()

