import { createClient } from '@/lib/supabase'
import type { 
  Agent, 
  AgentMessage, 
  BodyField, 
  FormField, 
  ApiCallOptions, 
  ApiResponse 
} from '@/lib/types'

/**
 * Process agent configuration body fields into form fields with default values
 */
export function processFormFields(bodyFields: BodyField[]): FormField[] {
  return bodyFields.map(field => ({
    name: field.name,
    type: field.type,
    label: field.label,
    required: field.required || false,
    placeholder: field.placeholder,
    options: field.options,
    value: field.default_value || ''
  }))
}

/**
 * Validate form data against required fields
 */
export function validateFormData(
  formFields: FormField[], 
  formData: Record<string, any>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  formFields.forEach(field => {
    if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
      errors.push(`${field.label} is required`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Make API call to external agent endpoint with proper configuration
 */
export async function callAgentApi(options: ApiCallOptions): Promise<ApiResponse> {
  const { agent, userMessage, formData, sessionId } = options
  
  try {
    if (!agent.api_url) {
      throw new Error('Agent API URL is not configured')
    }
    
    // Build request body following AI Agents repository pattern
    const requestBody: Record<string, any> = {
      query: userMessage,
      agent_role: agent.agent_role || '',
      prompt: agent.prompt || '',
      ...formData // Include all form field values
    }
    
    // Include session context if available
    if (sessionId) {
      requestBody.session_id = sessionId
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...agent.config?.headers || {}
    }
    
    // Make API call
    console.log('[Agent API] Request URL:', agent.api_url)
    const response = await fetch(agent.api_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}: ${response.statusText}`)
    }
    
    const responseData = await response.json()
    console.log('[Agent API] Response:', responseData)
    // Extract message following AI Agents repository pattern
    // Expected response format: [{ message: "..." }] or { message: "..." }
    let message = ''
    if (Array.isArray(responseData) && responseData.length > 0) {
      message = responseData[0]?.message || 'No response message'
    } else if (responseData?.message) {
      message = responseData.message
    } else {
      message = JSON.stringify(responseData)
    }
    
    return {
      success: true,
      data: responseData,
      message
    }
    
  } catch (error) {
    console.error('Agent API call error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Save user prompt and assistant response to Supabase agent_messages table
 */
export async function saveAgentMessages(
  agentId: string,
  sessionId: string,
  userPrompt: string,
  assistantResponse: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    // Save user message
    const { error: userError } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        UID: userId,
        agent_id: agentId,
        prompt: userPrompt,
        message: null // User prompts don't have message content
      })
    
    if (userError) {
      throw new Error(`Failed to save user message: ${userError.message}`)
    }
    
    // Save assistant response
    const { error: assistantError } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        UID: userId,
        agent_id: agentId,
        prompt: null, // Assistant responses don't have prompt content
        message: assistantResponse
      })
    
    if (assistantError) {
      throw new Error(`Failed to save assistant message: ${assistantError.message}`)
    }
    
    return { success: true }
    
  } catch (error) {
    console.error('Error saving agent messages:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Load conversation history for a specific session
 */
export async function loadSessionMessages(
  sessionId: string,
  userId: string
): Promise<{ success: boolean; messages?: AgentMessage[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('UID', userId)
      .order('created_at', { ascending: true })
    
    if (error) {
      throw new Error(`Failed to load messages: ${error.message}`)
    }
    
    return {
      success: true,
      messages: data || []
    }
    
  } catch (error) {
    console.error('Error loading session messages:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Load agent by ID with access control
 */
export async function loadAgent(
  agentId: string,
  userId?: string
): Promise<{ success: boolean; agent?: Agent; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()
    
    if (error) {
      throw new Error(`Agent not found: ${error.message}`)
    }
    
    // Check access permissions
    if (!data.is_public && data.UID !== userId) {
      throw new Error('You do not have permission to access this agent')
    }
    
    return {
      success: true,
      agent: data
    }
    
  } catch (error) {
    console.error('Error loading agent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  // Generate a proper UUID v4 for database compatibility
  return crypto.randomUUID()
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  // Generate a proper UUID v4 for consistency
  return crypto.randomUUID()
}

/**
 * Debounce helper for search and input fields
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Extract message title from content for session display
 */
export function extractMessageTitle(content: string, maxLength = 50): string {
  const cleaned = content.replace(/[^\w\s]/gi, ' ').trim()
  return cleaned.length > maxLength 
    ? cleaned.substring(0, maxLength) + '...'
    : cleaned || 'New Conversation'
}

/**
 * Format message content for display - handles special characters and basic cleanup
 */
export function formatMessageContent(content: string): string {
  if (!content) return ''
  
  // Basic content cleanup and formatting
  return content
    .trim()
    // Fix common encoding issues
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive whitespace while preserving intentional formatting
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
}

/**
 * Get agent sessions for sidebar display
 */
export async function getAgentSessions(
  agentId: string,
  userId: string
): Promise<{ success: boolean; sessions?: any[]; error?: string }> {
  try {
    const supabase = createClient()
    
    // Get unique sessions with latest message for each
    const { data, error } = await supabase
      .from('agent_messages')
      .select('session_id, created_at, prompt, message')
      .eq('agent_id', agentId)
      .eq('UID', userId)
      .not('session_id', 'is', null)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to load sessions: ${error.message}`)
    }
    
    // Group by session_id and get the first message for title
    const sessionMap = new Map()
    data?.forEach(msg => {
      if (!sessionMap.has(msg.session_id)) {
        const title = msg.prompt ? extractMessageTitle(msg.prompt) : 'New Conversation'
        sessionMap.set(msg.session_id, {
          id: msg.session_id,
          title,
          created_at: msg.created_at,
          updated_at: msg.created_at
        })
      }
    })
    
    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    
    return {
      success: true,
      sessions
    }
    
  } catch (error) {
    console.error('Error loading agent sessions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 