import { getServerAdminSettings, getButtonStyles, getButtonHoverStyles } from '@/lib/admin-settings'
import { ButtonProviderClient } from './button-provider-client'

export const dynamic = 'force-dynamic'

interface ButtonProviderProps {
  children: React.ReactNode
}

export async function ButtonProvider({ children }: ButtonProviderProps) {
  const adminSettings = await getServerAdminSettings()
  
  return (
    <ButtonProviderClient adminSettings={adminSettings}>
      {children}
    </ButtonProviderClient>
  )
} 