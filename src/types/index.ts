export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  completed: boolean
  createdAt: Date
}

export interface ShoppingList {
  id: string
  name: string
  description?: string
  items: ShoppingItem[]
  ownerId: string
  ownerName: string
  ownerEmail: string
  sharedWith: SharedUser[]
  shareCode?: string
  createdAt: Date
  updatedAt: Date
}

export interface SharedUser {
  id: string
  email: string
  name?: string
  canEdit: boolean
}

export type Category = 
  | 'frutas'
  | 'vegetais'
  | 'carnes'
  | 'laticinios'
  | 'padaria'
  | 'bebidas'
  | 'limpeza'
  | 'higiene'
  | 'outros'

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'frutas', label: 'Frutas', emoji: '🍎' },
  { value: 'vegetais', label: 'Vegetais', emoji: '🥬' },
  { value: 'carnes', label: 'Carnes', emoji: '🥩' },
  { value: 'laticinios', label: 'Laticínios', emoji: '🧀' },
  { value: 'padaria', label: 'Padaria', emoji: '🥖' },
  { value: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { value: 'limpeza', label: 'Limpeza', emoji: '🧹' },
  { value: 'higiene', label: 'Higiene', emoji: '🧴' },
  { value: 'outros', label: 'Outros', emoji: '📦' },
]

export const UNITS = [
  'un',
  'kg',
  'g',
  'L',
  'ml',
  'dz',
  'pct',
  'cx',
]


