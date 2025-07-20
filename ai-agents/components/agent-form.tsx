'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase'
import type { Agent } from '@/lib/types'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { Trash2, Plus, Bot } from 'lucide-react'
import * as Icons from 'lucide-react'

// Component to handle dropdown options with proper hydration
function DropdownOptionsSection({ form, bodyIndex, field }: any) {
  const [showDropdownOptions, setShowDropdownOptions] = useState(false)
  
  useEffect(() => {
    const subscription = form.watch((value: any) => {
      const formInput = value.body?.[bodyIndex]?.formInput
      setShowDropdownOptions(formInput === 'dropdown')
    })
    
    // Initial check
    const currentFormInput = form.getValues(`body.${bodyIndex}.formInput`)
    setShowDropdownOptions(currentFormInput === 'dropdown')
    
    return () => subscription.unsubscribe()
  }, [form, bodyIndex])

  if (!showDropdownOptions) {
    return null
  }

  return (
    <div className="space-y-3">
      <FormLabel>Dropdown Options</FormLabel>
      <FormDescription>
        Define the options users can select from
      </FormDescription>
      {field.dropdownOptions?.map((option: any, optionIndex: number) => (
        <div key={option.id} className="flex gap-2 items-end">
          <FormField
            control={form.control}
            name={`body.${bodyIndex}.dropdownOptions.${optionIndex}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Option value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`body.${bodyIndex}.dropdownOptions.${optionIndex}.label`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Option label" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              const currentOptions = form.getValues(`body.${bodyIndex}.dropdownOptions`) || []
              const updatedOptions = currentOptions.filter((_: any, idx: number) => idx !== optionIndex)
              form.setValue(`body.${bodyIndex}.dropdownOptions`, updatedOptions)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const currentOptions = form.getValues(`body.${bodyIndex}.dropdownOptions`) || []
          const newOption = {
            id: `dropdown-${bodyIndex}-${currentOptions.length}`,
            value: '',
            label: ''
          }
          form.setValue(`body.${bodyIndex}.dropdownOptions`, [...currentOptions, newOption])
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Option
      </Button>
    </div>
  )
}

const agentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  api_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  prompt: z.string().optional(),
  agent_role: z.string().optional(),
  is_public: z.boolean(),
  placeholder: z.string().optional(),
  max_tokens: z.string().optional(),
  temperature: z.string().optional(),
  top_p: z.string().optional(),
  icon: z.string().optional(),
  headers: z.array(z.object({
    id: z.string(),
    param: z.string(),
    value: z.string()
  })),
  body: z.array(z.object({
    id: z.string(),
    param: z.string(),
    value: z.string(),
    formInput: z.enum(['none', 'text', 'textarea', 'dropdown', 'website_credentials']),
    input_label: z.string().optional(),
    dropdownOptions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      value: z.string()
    }))
  }))
})

type AgentFormData = z.infer<typeof agentSchema>

interface AgentFormProps {
  mode: 'create' | 'edit'
  initialData?: Agent
}

export function AgentForm({ mode, initialData }: AgentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      api_url: '',
      prompt: '',
      agent_role: '',
      is_public: false,
      placeholder: 'How can I help you today?',
      max_tokens: '2000',
      temperature: '0.7',
      top_p: '0.9',
      icon: 'Bot',
      headers: [],
      body: []
    }
  })

  const { fields: headerFields, append: appendHeader, remove: removeHeader } = useFieldArray({
    control: form.control,
    name: 'headers'
  })

  const { fields: bodyFields, append: appendBody, remove: removeBody } = useFieldArray({
    control: form.control,
    name: 'body'
  })

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const config = initialData.config || {}
      
      // Transform headers
      const headers = Object.entries(config.headers || {}).map(([param, value], index) => ({
        id: `header-${index}`,
        param,
        value: value as string
      }))

      // Transform body fields
      const body = (config.body || []).map((field: any, index: number) => {
        const paramName = Object.keys(field).find(key => 
          !['input', 'input_label', 'dropdown_options'].includes(key)
        ) || ''

        const dropdownOptions = field.dropdown_options ? 
          Object.entries(field.dropdown_options).map(([value, label], idx) => ({
            id: `dropdown-${index}-${idx}`,
            label: label as string,
            value
          })) : []

        return {
          id: `body-${index}`,
          param: paramName,
          value: (field as any)[paramName] || '',
          formInput: field.input || 'text',
          input_label: field.input_label || '',
          dropdownOptions
        }
      })

      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category || '',
        api_url: initialData.api_url || '',
        prompt: initialData.prompt || '',
        agent_role: initialData.agent_role || '',
        is_public: initialData.is_public,
        placeholder: config.options?.placeholder || 'How can I help you today?',
        max_tokens: config.options?.max_tokens || '2000',
        temperature: config.options?.temperature || '0.7',
        top_p: config.options?.top_p || '0.9',
        icon: config.options?.icon || 'Bot',
        headers,
        body
      })
    }
  }, [mode, initialData, form])

  const onSubmit = async (data: AgentFormData) => {
    if (!user) {
      toast.error('You must be logged in to create an agent')
      return
    }

    setIsSubmitting(true)

    try {
      // Build config object
      const headers = data.headers.reduce((acc, header) => {
        if (header.param && header.value) {
          acc[header.param] = header.value
        }
        return acc
      }, {} as Record<string, string>)

      const body = data.body.map(field => {
        const bodyField: any = {
          [field.param]: field.value,
          input: field.formInput,
          input_label: field.input_label
        }

        if (field.dropdownOptions.length > 0) {
          bodyField.dropdown_options = field.dropdownOptions.reduce((acc, option) => {
            acc[option.value] = option.label
            return acc
          }, {} as Record<string, string>)
        }

        return bodyField
      })

      const config = {
        headers,
        body,
        options: {
          placeholder: data.placeholder,
          max_tokens: data.max_tokens,
          temperature: data.temperature,
          top_p: data.top_p,
          icon: data.icon
        }
      }

      const agentData = {
        name: data.name,
        description: data.description,
        category: data.category || null,
        api_url: data.api_url || null,
        prompt: data.prompt || null,
        agent_role: data.agent_role || null,
        is_public: data.is_public,
        config,
        UID: (user as any).id
      }

      if (mode === 'create') {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }
        const { error } = await supabase
          .from('agents')
          .insert(agentData)
          .throwOnError()

        if (error) throw error

        toast.success('Your Agent Has Been Created - You are now being redirected to the My Agents page.')
        router.push('/my-agents')
      } else {
        if (!initialData?.id) throw new Error('Agent ID is required for update')
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }
        const { error, data: updateData } = await supabase
          .from('agents')
          .update({
            ...agentData,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id)
          .eq('UID', (user as any).id)
          .select();

        if (error) throw error

        toast.success('Your Agent information has been saved.')
        // router.push('/ai-agents') // No redirect for update
      }

    } catch (error) {
      console.error('Error saving agent:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save agent')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addHeader = () => {
    appendHeader({
      id: `header-${Date.now()}`,
      param: '',
      value: ''
    })
  }

  const addBodyField = () => {
    appendBody({
      id: `body-${Date.now()}`,
      param: '',
      value: '',
      formInput: 'text',
      input_label: '',
      dropdownOptions: []
    })
  }

  const iconOptions = [
    'Bot', 'MessageSquare', 'Brain', 'Zap', 'Code', 'PenTool', 'BarChart3', 
    'TrendingUp', 'Search', 'Shield', 'Heart', 'Star', 'Lightbulb', 'Target'
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {mode === 'create' ? 'Create New Agent' : 'Edit Agent'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {mode === 'create' 
            ? 'Configure your AI agent with custom settings and behaviors' 
            : 'Update your agent configuration and settings'
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core details about your AI agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My AI Assistant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Content & Writing" {...field} />
                      </FormControl>
                      <FormDescription>
                        Help users discover your agent by category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what your agent can help with..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="api_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.example.com/agent" {...field} />
                    </FormControl>
                    <FormDescription>
                      The endpoint where agent requests will be sent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Agent</FormLabel>
                      <FormDescription>
                        Make this agent visible to all users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Agent Behavior */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Behavior</CardTitle>
              <CardDescription>
                Configure how your agent behaves and responds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="agent_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Role</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="You are a helpful assistant that..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Define the role and personality of your agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional instructions for the agent..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Additional prompt instructions for the agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* UI Options */}
          <Card>
            <CardHeader>
              <CardTitle>UI Options</CardTitle>
              <CardDescription>
                Customize the user interface for your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => {
                            const IconComponent = (Icons as any)[icon]
                            return (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4" />
                                  {icon}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeholder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chat Placeholder</FormLabel>
                      <FormControl>
                        <Input placeholder="How can I help you today?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="max_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens</FormLabel>
                      <FormControl>
                        <Input placeholder="2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature</FormLabel>
                      <FormControl>
                        <Input placeholder="0.7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="top_p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top P</FormLabel>
                      <FormControl>
                        <Input placeholder="0.9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* HTTP Headers */}
          <Card>
            <CardHeader>
              <CardTitle>HTTP Headers</CardTitle>
              <CardDescription>
                Configure headers to be sent with API requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {headerFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`headers.${index}.param`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Header Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Authorization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`headers.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Header Value</FormLabel>
                        <FormControl>
                          <Input placeholder="Bearer token..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeHeader(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addHeader}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Header
              </Button>
            </CardContent>
          </Card>

          {/* Body Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Body Parameters</CardTitle>
              <CardDescription>
                Define form fields that users will fill when using your agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {bodyFields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Parameter {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeBody(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`body.${index}.param`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parameter Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., topic, category" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the parameter to send to your API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`body.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Value</FormLabel>
                          <FormControl>
                            <Input placeholder="Default value..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Default value for this parameter
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`body.${index}.formInput`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Input Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select input type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None (Hidden)</SelectItem>
                              <SelectItem value="text">Text Input</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                              <SelectItem value="website_credentials">Website Selection</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How users will input this parameter
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`body.${index}.input_label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Input Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Label shown to users..." {...field} />
                          </FormControl>
                          <FormDescription>
                            The label users will see for this field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dropdown Options - conditionally rendered */}
                  <DropdownOptionsSection 
                    form={form} 
                    bodyIndex={index} 
                    field={field} 
                  />
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addBodyField}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Body Parameter
              </Button>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? `${mode === 'create' ? 'Creating' : 'Updating'}...` 
                : `${mode === 'create' ? 'Create Agent' : 'Update Agent'}`
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 