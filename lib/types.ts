// Supabase Auth Types (our own definitions)
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: any
  app_metadata?: any
  subscription?: {
    id: string
    plan: string
    status: string
    currentPeriodEnd?: string
  } | null
  role?: string
}

export interface AuthSession {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at?: number
}

export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

// AI Agent Types
export interface Agent {
  id: string
  name: string
  description?: string | null
  api_url?: string | null
  prompt?: string | null
  agent_role?: string | null
  is_public: boolean
  UID: string
  config?: AgentConfig | null
  category?: string | null
  icon?: string | null
  created_at?: string
  updated_at?: string
}

export interface AgentConfig {
  headers?: Record<string, string>
  body?: BodyField[]
  options?: {
    icon?: string
    top_p?: string
    max_tokens?: string
    placeholder?: string
    temperature?: string
  }
}

export interface BodyField {
  name: string
  type: 'text' | 'textarea' | 'dropdown' | 'website_credentials' | 'checkbox' | 'number'
  label: string
  required?: boolean
  placeholder?: string
  options?: string[] // For dropdown fields
  default_value?: string
}

export interface FormField {
  name: string
  type: 'text' | 'textarea' | 'dropdown' | 'website_credentials' | 'checkbox' | 'number'
  label: string
  required: boolean
  placeholder?: string
  options?: (string | { value: string; label: string })[]
  value: string
}

export interface AgentMessage {
  id: string
  session_id?: string | null
  created_at?: string
  UID?: string | null
  agent_id?: string | null
  prompt?: string | null
  message?: string | null
  post_id?: string | null
}

export interface Session {
  id: string
  title: string
  agent_id: string
  created_at: string
  updated_at: string
}

export interface ApiCallOptions {
  agent: Agent
  userMessage: string
  formData: Record<string, unknown> // TODO: Replace 'unknown' with a more specific type if possible
  sessionId?: string
  userId: string
}

export interface ApiResponse {
  success: boolean
  data?: unknown // TODO: Replace 'unknown' with a more specific type if possible
  message?: string
  error?: string
}