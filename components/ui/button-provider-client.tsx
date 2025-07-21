'use client'

import { createContext, useContext } from 'react'

interface AdminSettings {
  button_color?: string
  button_text_color?: string
  button_hover_color?: string
  link_color?: string
  link_hover_color?: string
  dark_button_color?: string
  dark_button_text_color?: string
  dark_button_hover_color?: string
  dark_link_color?: string
  dark_link_hover_color?: string
  [key: string]: any
}

interface ButtonContextType {
  adminSettings: AdminSettings | null
  getButtonStyles: (variant?: string) => any
  getButtonHoverStyles: (variant?: string) => any
}

const ButtonContext = createContext<ButtonContextType | null>(null)

export function useButtonContext() {
  const context = useContext(ButtonContext)
  if (!context) {
    throw new Error('useButtonContext must be used within ButtonProviderClient')
  }
  return context
}

interface ButtonProviderClientProps {
  children: React.ReactNode
  adminSettings: AdminSettings | null
}

export function ButtonProviderClient({ children, adminSettings }: ButtonProviderClientProps) {
  const getButtonStyles = (variant: string = 'default') => {
    if (!adminSettings) {
      return {
        backgroundColor: '#000000',
        color: '#ffffff',
        borderColor: '#000000'
      }
    }

    return {
      backgroundColor: adminSettings.button_color || '#000000',
      color: adminSettings.button_text_color || '#ffffff',
      borderColor: adminSettings.button_color || '#000000'
    }
  }

  const getButtonHoverStyles = (variant: string = 'default') => {
    if (!adminSettings) {
      return {
        backgroundColor: '#333333',
        color: '#ffffff'
      }
    }

    return {
      backgroundColor: adminSettings.button_hover_color || '#333333',
      color: adminSettings.button_text_color || '#ffffff'
    }
  }

  return (
    <ButtonContext.Provider value={{ adminSettings, getButtonStyles, getButtonHoverStyles }}>
      {children}
    </ButtonContext.Provider>
  )
} 