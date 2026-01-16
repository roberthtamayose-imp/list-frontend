import { create } from 'zustand'
import { api, ShoppingList, ShoppingItem, CreateItemData } from '@/lib/api'

interface StoreState {
  // State
  lists: ShoppingList[]
  currentListId: string | null
  isLoading: boolean
  error: string | null
  
  // Token management
  setToken: (token: string | null) => void
  
  // List actions
  fetchLists: () => Promise<void>
  fetchList: (listId: string) => Promise<ShoppingList | null>
  createList: (name: string, description?: string) => Promise<ShoppingList | null>
  updateList: (listId: string, updates: { name?: string; description?: string }) => Promise<void>
  deleteList: (listId: string) => Promise<void>
  setCurrentList: (listId: string | null) => void
  getCurrentList: () => ShoppingList | null
  
  // Item actions
  addItem: (listId: string, item: CreateItemData) => Promise<ShoppingItem | null>
  updateItem: (listId: string, itemId: string, updates: Partial<CreateItemData>) => Promise<void>
  deleteItem: (listId: string, itemId: string) => Promise<void>
  toggleItem: (listId: string, itemId: string) => Promise<void>
  
  // Share actions
  generateShareCode: (listId: string) => Promise<string | null>
  joinListByCode: (code: string) => Promise<ShoppingList | null>
  removeSharedUser: (listId: string, userId: string) => Promise<void>
  
  // Helper
  getUserLists: () => ShoppingList[]
  clearError: () => void
}

export const useStore = create<StoreState>()((set, get) => ({
  lists: [],
  currentListId: null,
  isLoading: false,
  error: null,
  
  setToken: (token) => {
    api.setToken(token)
  },
  
  fetchLists: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await api.getLists()
    
    if (error) {
      set({ isLoading: false, error })
      return
    }
    
    set({ lists: data || [], isLoading: false })
  },
  
  fetchList: async (listId) => {
    set({ isLoading: true, error: null })
    const { data, error } = await api.getList(listId)
    
    if (error) {
      set({ isLoading: false, error })
      return null
    }
    
    // Update the list in local state
    if (data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId ? data : list
        ),
        isLoading: false,
      }))
      
      // If this list isn't in our lists array, add it
      const state = get()
      if (!state.lists.find((l) => l.id === listId)) {
        set((state) => ({
          lists: [...state.lists, data],
        }))
      }
    }
    
    return data || null
  },
  
  createList: async (name, description) => {
    set({ isLoading: true, error: null })
    const { data, error } = await api.createList(name, description)
    
    if (error) {
      set({ isLoading: false, error })
      return null
    }
    
    if (data) {
      set((state) => ({
        lists: [...state.lists, data],
        currentListId: data.id,
        isLoading: false,
      }))
    }
    
    return data || null
  },
  
  updateList: async (listId, updates) => {
    set({ error: null })
    const { data, error } = await api.updateList(listId, updates)
    
    if (error) {
      set({ error })
      return
    }
    
    if (data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId ? data : list
        ),
      }))
    }
  },
  
  deleteList: async (listId) => {
    set({ error: null })
    const { error } = await api.deleteList(listId)
    
    if (error) {
      set({ error })
      return
    }
    
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== listId),
      currentListId: state.currentListId === listId ? null : state.currentListId,
    }))
  },
  
  setCurrentList: (listId) => {
    set({ currentListId: listId })
  },
  
  getCurrentList: () => {
    const state = get()
    return state.lists.find((list) => list.id === state.currentListId) || null
  },
  
  addItem: async (listId, item) => {
    set({ error: null })
    const { data, error } = await api.createItem(listId, item)
    
    if (error) {
      set({ error })
      return null
    }
    
    if (data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId
            ? { ...list, items: [...list.items, data] }
            : list
        ),
      }))
    }
    
    return data || null
  },
  
  updateItem: async (listId, itemId, updates) => {
    set({ error: null })
    const { data, error } = await api.updateItem(listId, itemId, updates)
    
    if (error) {
      set({ error })
      return
    }
    
    if (data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? data : item
                ),
              }
            : list
        ),
      }))
    }
  },
  
  deleteItem: async (listId, itemId) => {
    set({ error: null })
    const { error } = await api.deleteItem(listId, itemId)
    
    if (error) {
      set({ error })
      return
    }
    
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
            }
          : list
      ),
    }))
  },
  
  toggleItem: async (listId, itemId) => {
    set({ error: null })
    const { data, error } = await api.toggleItem(listId, itemId)
    
    if (error) {
      set({ error })
      return
    }
    
    if (data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? data : item
                ),
              }
            : list
        ),
      }))
    }
  },
  
  generateShareCode: async (listId) => {
    set({ error: null })
    const { data, error } = await api.generateShareCode(listId)
    
    if (error) {
      set({ error })
      return null
    }
    
    if (data?.shareCode) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId
            ? { ...list, shareCode: data.shareCode }
            : list
        ),
      }))
      return data.shareCode
    }
    
    return null
  },
  
  joinListByCode: async (code) => {
    set({ isLoading: true, error: null })
    const { data, error } = await api.joinListByCode(code)
    
    if (error) {
      set({ isLoading: false, error })
      return null
    }
    
    if (data) {
      set((state) => ({
        lists: [...state.lists.filter((l) => l.id !== data.id), data],
        isLoading: false,
      }))
    }
    
    return data || null
  },
  
  removeSharedUser: async (listId, userId) => {
    set({ error: null })
    const { error } = await api.removeShare(listId, userId)
    
    if (error) {
      set({ error })
      return
    }
    
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              sharedWith: list.sharedWith.filter((u) => u.id !== userId),
            }
          : list
      ),
    }))
  },
  
  getUserLists: () => {
    return get().lists
  },
  
  clearError: () => {
    set({ error: null })
  },
}))
