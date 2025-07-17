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

  // Process agent configuration into form fields
  useEffect(() => {
    if (agent.config?.body && Array.isArray(agent.config.body)) {
      const processedFields = processFormFields(agent.config.body)
      setFormFields(processedFields)
      // Always set all fields in formData, ensuring default values are present
      const initialData: Record<string, any> = {}
      processedFields.forEach(field => {
        // Use value from formData if present, otherwise default
        initialData[field.name] = (formData && field.name in formData)
          ? formData[field.name]
          : (typeof field.value === 'string' ? field.value : '')
      })
      // Always update to ensure all default values are present
      onFormDataChange(initialData)
    } else {
      setFormFields([])
      // Clear form data when no fields
      onFormDataChange({})
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

      case 'dropdown': {
        // Support both string and object options
        const options = field.options as (string | { value: string; label: string })[] | undefined;
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
              {options?.map((option) => {
                if (
                  typeof option === 'object' &&
                  option !== null &&
                  'value' in option &&
                  'label' in option &&
                  typeof (option as any).value === 'string' &&
                  typeof (option as any).label === 'string'
                ) {
                  const opt = option as { value: string; label: string };
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  );
                } else if (typeof option === 'string') {
                  return (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  );
                } else {
                  return null;
                }
              })}
            </SelectContent>
          </Select>
        )
      }

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
      {/* Form Fields - Always visible */}
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
    </div>
  )
} 