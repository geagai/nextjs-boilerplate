"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { processFormFields, validateFormData } from '@/lib/ai-agent-utils'
import type { Agent, FormField, BodyField } from '@/lib/types'
import { AlertCircle, Settings } from 'lucide-react'

interface DynamicFormFieldsProps {
  agent: Agent
  formData: Record<string, any>
  onFormDataChange: (data: Record<string, any>) => void
  onValidationChange: (isValid: boolean, errors: string[]) => void
  disabled?: boolean
  className?: string
}

export function DynamicFormFields({
  agent,
  formData,
  onFormDataChange,
  onValidationChange,
  disabled = false,
  className = ""
}: DynamicFormFieldsProps) {
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  // Process agent configuration into form fields
  useEffect(() => {
    if (agent.config?.body && Array.isArray(agent.config.body)) {
      const processedFields = processFormFields(agent.config.body)
      setFormFields(processedFields)
      
      // Initialize form data with default values
      const initialData: Record<string, any> = {}
      processedFields.forEach(field => {
        if (field.value && !formData[field.name]) {
          initialData[field.name] = field.value
        }
      })
      
      if (Object.keys(initialData).length > 0) {
        onFormDataChange({ ...formData, ...initialData })
      }
    } else {
      setFormFields([])
    }
  }, [agent.config?.body])

  // Validate form data whenever it changes
  useEffect(() => {
    if (formFields.length > 0) {
      const validation = validateFormData(formFields, formData)
      setValidationErrors(validation.errors)
      onValidationChange(validation.isValid, validation.errors)
    } else {
      setValidationErrors([])
      onValidationChange(true, [])
    }
  }, [formData, formFields, onValidationChange])

  const handleFieldChange = (fieldName: string, value: any) => {
    const updatedData = { ...formData, [fieldName]: value }
    onFormDataChange(updatedData)
  }

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`
    const hasError = validationErrors.some(error => error.includes(field.label))
    
    const commonProps = {
      id: fieldId,
      disabled,
      className: hasError ? "border-red-500" : ""
    }

    switch (field.type) {
      case 'text':
      case 'website_credentials':
        return (
          <Input
            {...commonProps}
            type={field.type === 'website_credentials' ? 'password' : 'text'}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={3}
          />
        )

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case 'dropdown':
        return (
          <Select
            value={formData[field.name] || ''}
            onValueChange={(value) => handleFieldChange(field.name, value)}
            disabled={disabled}
          >
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={formData[field.name] === true || formData[field.name] === 'true'}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
              disabled={disabled}
            />
            <Label 
              htmlFor={fieldId} 
              className="text-sm font-normal cursor-pointer"
            >
              {field.placeholder || field.label}
            </Label>
          </div>
        )

      default:
        return (
          <Input
            {...commonProps}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )
    }
  }

  // If no form fields, don't render anything
  if (formFields.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Collapsible Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Configuration ({formFields.length} field{formFields.length !== 1 ? 's' : ''})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>

      {/* Form Fields */}
      {isExpanded && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label 
                    htmlFor={`field-${field.name}`}
                    className="text-sm font-medium"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 