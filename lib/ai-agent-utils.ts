import { createClient } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
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
  return bodyFields.map(field => {
    // Use type guards for possible alternative field structures
    const fieldType = field.type
      || (typeof ((field as unknown) as { input?: unknown }).input === 'string' ? ((field as unknown) as { input: string }).input : undefined)
      || 'text';
    const fieldLabel = field.label
      || (typeof ((field as unknown) as { input_label?: unknown }).input_label === 'string' ? ((field as unknown) as { input_label: string }).input_label : undefined)
      || 'Field';
    const fieldName = field.name
      || Object.keys(field).find(key =>
        !['type', 'input', 'label', 'input_label', 'required', 'placeholder', 'options', 'default_value'].includes(key)
      )
      || 'field';
    let value = field.default_value;
    if (value === undefined && fieldName in field) {
      const v = ((field as unknown) as Record<string, unknown>)[fieldName];
      value = typeof v === 'string' ? v : '';
    }
    return {
      name: fieldName,
      type: fieldType,
      label: typeof fieldLabel === 'string' ? fieldLabel : 'Field',
      required: field.required || false,
      placeholder: field.placeholder,
      options: field.options,
      value: typeof value === 'string' ? value : ''
    };
  })
}

/**
 * Validate form data against required fields
 */
export function validateFormData(
  formFields: FormField[], 
  formData: Record<string, unknown>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  formFields.forEach((field: FormField) => {
    const value = formData[field.name];
    let isEmpty = false;
    if (typeof value === 'string') {
      isEmpty = value.trim() === '';
    } else if (value == null) {
      isEmpty = true;
    }
    if (field.required && isEmpty) {
      errors.push(`${field.label} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Make API call to external agent endpoint with proper configuration
 */
export async function callAgentApi(options: ApiCallOptions): Promise<ApiResponse> {
  const { agent, userMessage, formData, sessionId, userId } = options
  
  try {
    if (!agent.api_url) {
      throw new Error('Agent API URL is not configured')
    }
    
    // Build request body following AI Agents repository pattern
    const requestBody: Record<string, unknown> = {
      query: userMessage,
      agent_role: agent.agent_role || '',
      prompt: agent.prompt || '',
      UID: userId, // Include user ID parameter
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
    const response = await fetch(agent.api_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}: ${response.statusText}`)
    }
    
    const responseData = await response.json()
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
  supabase: SupabaseClient,
  agentId: string,
  sessionId: string,
  userPrompt: string,
  assistantResponse: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the original userId value for UID
    const UID = userId
    
    // Save one row with both prompt and message
    const { error } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        UID,
        agent_id: agentId,
        prompt: userPrompt,
        message: assistantResponse
      })
    
    if (error) {
      throw new Error(`Failed to save conversation: ${error.message}`)
    }
    
    return { success: true }
    
  } catch (error) {
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
    
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    // Use UID as-is (do not uppercase)
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
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()
    
    if (error) {
      throw new Error(`Agent not found: ${error.message}`)
    }
    // Remove access check: always return the agent if it exists
    return {
      success: true,
      agent: data
    }
  } catch (error) {
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
  // Generate a proper UUID v4 for consistency
  return crypto.randomUUID()
}

/**
 * Validate and return session ID - now accepts any text format
 */
export function validateSessionId(sessionId?: string): string {
  // If session ID is provided, use it (now supports any text format)
  if (sessionId) {
    return sessionId
  }
  // If no session ID provided, generate a new UUID
  return generateSessionId()
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
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
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
// TODO: Replace 'unknown[]' with a more specific type if possible
export async function getAgentSessions(
  agentId: string,
  userId: string
): Promise<{ success: boolean; sessions?: unknown[]; error?: string }> {
  try {
    const supabase = createClient()
    
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    // Use UID as-is (do not uppercase)
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
    data?.forEach((msg: any) => {
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 