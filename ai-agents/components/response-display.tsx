"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAdminSettings } from '@/components/admin-settings-provider'
import { formatMessageContent } from '@/lib/ai-agent-utils'
import { 
  Bot, 
  User, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Code, 
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  isLoading?: boolean
  error?: string
  rawData?: any
}

interface ResponseDisplayProps {
  messages: Message[]
  isLoading?: boolean
  agent?: {
    name: string
    config?: {
      options?: {
        icon?: string
      }
    }
  }
  className?: string
  onRetry?: (messageId: string) => void
}

export function ResponseDisplay({
  messages,
  isLoading = false,
  agent,
  className = "",
  onRetry
}: ResponseDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const toggleExpanded = (messageId: string) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedMessages(newExpanded)
  }

  const formatContent = (content: string, isExpanded: boolean = false) => {
    const formatted = formatMessageContent(content)
    
    // Truncate long content if not expanded
    if (!isExpanded && formatted.length > 1000) {
      return formatted.substring(0, 1000) + '...'
    }
    
    return formatted
  }

  const detectContentType = (content: string) => {
    const trimmed = content.trim()
    
    // Check if it's JSON
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed)
        return 'json'
      } catch {
        return 'text'
      }
    }
    
    // Check if it contains HTML tags
    if (/<[^>]*>/g.test(trimmed)) {
      return 'html'
    }
    
    // Check if it has markdown-like formatting
    if (/(\*\*|__|`|#|\-|\+|\*)\s/.test(trimmed) || /\[.*\]\(.*\)/.test(trimmed)) {
      return 'markdown'
    }
    
    return 'text'
  }

  const renderContent = (content: string, contentType: string, isExpanded: boolean) => {
    const formattedContent = formatContent(content, isExpanded)
    
    switch (contentType) {
      case 'json':
        try {
          const jsonObj = JSON.parse(content)
          return (
            <pre className="bg-muted/50 p-3 rounded-md text-sm overflow-x-auto">
              <code>{JSON.stringify(jsonObj, null, 2)}</code>
            </pre>
          )
        } catch {
          return <div className="whitespace-pre-wrap break-words">{formattedContent}</div>
        }
      
      case 'html':
        return (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        )
      
      case 'markdown':
        // Simple markdown-like formatting
        let processedContent = formattedContent
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
          .replace(/\n/g, '<br>')
        
        return (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        )
      
      default:
        return <div className="whitespace-pre-wrap break-words">{formattedContent}</div>
    }
  }

  const MessageComponent = ({ message }: { message: Message }) => {
    const contentType = detectContentType(message.content)
    const isExpanded = expandedMessages.has(message.id)
    const needsExpansion = message.content.length > 1000

    return (
      <div
        className={`flex gap-3 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        {message.role === 'assistant' && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
        
        <div
          className={`max-w-[85%] min-w-[200px] ${
            message.role === 'user' ? 'ml-auto' : ''
          }`}
        >
          <Card className={message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}>
            <CardContent className="p-4">
              {/* Message Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {message.role === 'user' && (
                    <User className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'You' : agent?.name || 'Assistant'}
                  </span>
                  {contentType !== 'text' && (
                    <Badge variant="outline" className="text-xs">
                      <Code className="w-3 h-3 mr-1" />
                      {contentType.toUpperCase()}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {message.isLoading && (
                    <Clock className="w-3 h-3 animate-pulse text-muted-foreground" />
                  )}
                  {message.error && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Loading State */}
              {message.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : message.error ? (
                /* Error State */
                <div className="space-y-3">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {message.error}
                    </AlertDescription>
                  </Alert>
                  {onRetry && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onRetry(message.id)}
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              ) : (
                /* Message Content */
                <div className="space-y-3">
                  <div className="message-content">
                    {renderContent(message.content, contentType, isExpanded)}
                  </div>
                  
                  {/* Content Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      {needsExpansion && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(message.id)}
                          className="text-xs"
                        >
                          {isExpanded ? (
                            <>
                              <Minimize2 className="w-3 h-3 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-3 h-3 mr-1" />
                              Show More
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(message.content, message.id)}
                      className="text-xs"
                    >
                      {copiedId === message.id ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {message.role === 'user' && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-4 p-1">
          {messages.length === 0 && !isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-sm">
                Configure any needed settings above and ask {agent?.name || 'the agent'} anything to get started!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))
          )}
          
        </div>
      </ScrollArea>
    </div>
  )
} 