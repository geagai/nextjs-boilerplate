"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Settings, X } from 'lucide-react'
import { DynamicFormFields } from './dynamic-form-fields'
import type { Agent } from '@/lib/types'

interface AgentConfigSidebarProps {
  agent: Agent
  formData: Record<string, any>
  onFormDataChange: (data: Record<string, any>) => void
  onValidationChange: (isValid: boolean, errors: string[]) => void
  disabled?: boolean
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
  adminSettings?: any
}

export function AgentConfigSidebar({
  agent,
  formData,
  onFormDataChange,
  onValidationChange,
  disabled = false,
  isOpen,
  onClose,
  isMobile,
  adminSettings
}: AgentConfigSidebarProps) {
  // Helper functions for button styling
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

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ paddingBottom: '75px' }}>
      <div className="p-4 border-b">
        <div className={`flex items-center justify-between ${isMobile ? 'mb-0' : 'm-0'}`}>
          {!isMobile && <h2 className="text-lg font-semibold mt-0">Agent Configuration</h2>}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {agent.config?.body && agent.config.body.length > 0 ? (
            <DynamicFormFields
              agent={agent}
              formData={formData}
              onFormDataChange={onFormDataChange}
              onValidationChange={onValidationChange}
              disabled={disabled}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No configuration options available</p>
            </div>
          )}
          {/* Add extra bottom padding for scrollable area */}
          <div className="pb-24" />
        </div>
      </ScrollArea>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="p-0" style={{ width: 400, maxWidth: '95vw' }}>
          <SheetHeader className="sr-only">
            <SheetTitle>Agent Configuration</SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={`bg-background border-l transition-all duration-300 ${
        isOpen ? '' : 'w-0'
      } overflow-hidden`}
      style={isOpen ? { width: 400, maxWidth: '95vw' } : { width: 0 }}
    >
      {isOpen && sidebarContent}
    </div>
  )
} 