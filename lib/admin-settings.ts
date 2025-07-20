import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function getServerAdminSettings() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  if (!supabase) {
    return null
  }

  try {
    const { data: adminSettings, error } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching admin settings:', error)
      return null
    }

    return adminSettings
  } catch (error) {
    console.error('Error in getServerAdminSettings:', error)
    return null
  }
}

// Helper function to get button styles from admin settings
export function getButtonStyles(adminSettings: any) {
  if (!adminSettings) {
    return {
      backgroundColor: '#000000',
      color: '#ffffff',
      borderColor: '#000000'
    }
  }

  return {
    backgroundColor: adminSettings.button_background_color || '#000000',
    color: adminSettings.button_text_color || '#ffffff',
    borderColor: adminSettings.button_border_color || '#000000'
  }
}

// Helper function to get button hover styles from admin settings
export function getButtonHoverStyles(adminSettings: any) {
  if (!adminSettings) {
    return {
      backgroundColor: '#333333',
      color: '#ffffff'
    }
  }

  return {
    backgroundColor: adminSettings.button_hover_background_color || '#333333',
    color: adminSettings.button_hover_text_color || '#ffffff'
  }
} 