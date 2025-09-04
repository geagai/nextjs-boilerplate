'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Edit, Trash2, Loader2, Copy, HelpCircle } from 'lucide-react'

interface EmailTemplate {
  id: string
  user_id: string
  subject: string
  body: string
  signature: string
  type: string
  enable_ai: boolean
  created_at: string
}

interface EmailTemplatesClientProps {
  initialTemplates: EmailTemplate[]
  userId: string
}

export function EmailTemplatesClient({ initialTemplates, userId }: EmailTemplatesClientProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    signature: '',
    type: '',
    enable_ai: false
  })

  const handleCreateNew = () => {
    setEditingTemplate(null)
    setFormData({
      subject: '',
      body: '',
      signature: '',
      type: '',
      enable_ai: false
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setFormData({
      subject: template.subject,
      body: template.body,
      signature: template.signature || '',
      type: template.type || '',
      enable_ai: template.enable_ai || false
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.type || !formData.subject.trim() || !formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Type, subject, and email content are required.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    try {
      const url = editingTemplate ? `/api/email-templates/${editingTemplate.id}` : '/api/email-templates'
      const method = editingTemplate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formData.subject,
          body: formData.body,
          signature: formData.signature,
          type: formData.type,
          enable_ai: formData.enable_ai,
        }),
      })

      if (response.ok) {
        const savedTemplate = await response.json()
        
        if (editingTemplate) {
          setTemplates(prev => 
            prev.map(t => t.id === editingTemplate.id ? savedTemplate : t)
          )
          toast({
            title: 'Template Updated',
            description: 'Your email template has been updated successfully.',
          })
        } else {
          setTemplates(prev => [savedTemplate, ...prev])
          toast({
            title: 'Template Created',
            description: 'Your email template has been created successfully.',
          })
        }
        
        setIsDialogOpen(false)
        setEditingTemplate(null)
        setFormData({ subject: '', body: '', signature: '', type: '', enable_ai: false })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save template.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    setIsDeleting(templateId)

    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== templateId))
        toast({
          title: 'Template Deleted',
          description: 'Your email template has been deleted successfully.',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete template.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleCopy = async (template: EmailTemplate) => {
    // Strip HTML tags for plain text copy
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }
    
    const emailContent = `Subject: ${template.subject}\n\n${stripHtml(template.body)}\n\n${template.signature || ''}`
    
    try {
      await navigator.clipboard.writeText(emailContent)
      toast({
        title: 'Copied to Clipboard',
        description: 'Email template content has been copied to your clipboard.',
      })
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Templates ({templates.length})
          </h2>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't created any email templates yet.
            </p>
            <Button onClick={handleCreateNew} variant="outline">
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.subject}</CardTitle>
                <CardDescription>
                  Created {new Date(template.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div 
                      className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: template.body }}
                    />
                  </div>
                  {template.type && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Type: {template.type}
                      </p>
                    </div>
                  )}
                  {template.signature && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Signature: {template.signature}
                      </p>
                    </div>
                  )}
                  {template.enable_ai && (
                    <div>
                      <p className="text-xs text-blue-500 dark:text-blue-400">
                        🤖 AI Enabled
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      disabled={isDeleting === template.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {isDeleting === template.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Update your email template below.' 
                : 'Create a new email template for your outreach campaigns.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type *</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Subject *</label>
              <Input
                placeholder="Enter email subject..."
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Email Content *</label>
              <RichTextEditor
                value={formData.body}
                onChange={(html) => setFormData(prev => ({ ...prev, body: html }))}
                placeholder="Enter email content..."
                className="mt-1"
                minHeight={200}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Signature (Optional)</label>
              <Textarea
                placeholder="Enter your email signature..."
                value={formData.signature}
                onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable_ai"
                checked={formData.enable_ai}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_ai: checked as boolean }))}
              />
              <label htmlFor="enable_ai" className="text-sm font-medium">
                Enable AI
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enabling AI will allow the software to use AI to modify the email before being sent.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingTemplate ? 'Update Template' : 'Create Template'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
