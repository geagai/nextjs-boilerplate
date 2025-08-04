"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { createClient } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'

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
  /**
   * Optional callback when a message is deleted. Should remove the message from the parent state.
   * Receives the deleted message id.
   */
  onDeleteMessage?: (id: string) => void
  adminSettings?: any
}

export function ResponseDisplay({
  messages,
  isLoading = false,
  agent,
  className = "",
  onRetry,
  onDeleteMessage
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
    
    // Check if it contains HTML tags first (prioritize HTML over markdown)
    const hasHtmlTags = /<[a-zA-Z][^>]*>.*?<\/[a-zA-Z][^>]*>/.test(trimmed) || 
                       /<[a-zA-Z][^>]*\/>/.test(trimmed) ||
                       /<[a-zA-Z][^>]*>/.test(trimmed)
    
    // If it has HTML tags, it's HTML (regardless of markdown features)
    if (hasHtmlTags) {
      return 'html'
    }
    
    // Improved markdown detection: only if no HTML tags found
    const hasMarkdownFeatures = (
      /\*\*.*?\*\*/.test(trimmed) ||      // **bold**
      /__.*?__/.test(trimmed) ||            // __bold__
      /`.*?`/.test(trimmed) ||              // `inline code`
      /#+\s.*$/m.test(trimmed) ||           // # Header (multiline)
      /^[-+*]\s+/m.test(trimmed) ||         // - list, + list, * list (at line start)
      /\[.*?\]\(.*?\)/.test(trimmed) ||     // [link](url)
      /^\|.*\|$/m.test(trimmed) ||          // | table | rows |
      /^>\s+/m.test(trimmed) ||             // > blockquote
      /```[\s\S]*```/.test(trimmed) ||      // ``` code blocks ```
      /^\d+\.\s+/m.test(trimmed)            // 1. numbered lists
    )
    
    // If it has markdown features and no HTML, it's markdown
    if (hasMarkdownFeatures) {
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
          return <div className="whitespace-pre-wrap break-words" style={{ fontSize: '0.8rem' }}>{formattedContent}</div>
        }
      
      case 'html':
        return (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        )
      
      case 'markdown':
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                // Custom table styling
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {children}
                  </td>
                ),
                // Preserve line breaks in code blocks
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>;
                  }
                  return (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                      <code className={className}>{children}</code>
                    </pre>
                  );
                },
                // Better list styling
                ul: ({ children }) => <ul className="list-disc space-y-1 pl-5 !list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5 !list-decimal">{children}</ol>,
                li: ({ children }) => <li className="mb-1 !list-item">{children}</li>,
                // Better heading styling
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base font-bold mt-3 mb-2">{children}</h4>,
                h5: ({ children }) => <h5 className="text-sm font-bold mt-2 mb-1">{children}</h5>,
                h6: ({ children }) => <h6 className="text-xs font-bold mt-2 mb-1">{children}</h6>,
                // Better paragraph spacing
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                // Better blockquote styling
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic bg-gray-50 dark:bg-gray-900 py-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {formattedContent}
            </ReactMarkdown>
          </div>
        )
      
      default:
        return <div className="whitespace-pre-wrap break-words" style={{ fontSize: '0.8rem' }}>{formattedContent}</div>
    }
  }

  const handleDelete = async (message: Message) => {
    // Only allow deletion of AI response messages
    if (message.role !== 'assistant') {
      return;
    }
    
    // Extract the database row ID from the message
    // For messages loaded from database, use rawData.id
    // For new messages, the ID should already be the database row ID
    const dbRowId = message.rawData?.id || message.id;
    if (!dbRowId) return;
    
    try {
      // Call the API route to delete the message
      const response = await fetch('/api/agents/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: dbRowId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete message');
      }

      // Notify parent to remove from UI
      if (typeof onDeleteMessage === 'function') {
        onDeleteMessage(message.id);
      }
      
      toast({ title: 'Message successfully deleted.' });
    } catch (error) {
      console.error('Delete message error:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to delete message', 
        variant: 'destructive' 
      });
    }
  };

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
          <Card className={`${message.role === 'user' ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : ''} ${message.role === 'assistant' ? 'md:px-6' : ''}`}>
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
                </div>
              ) : (
                /* Message Content */
                <div className="space-y-3">
                  <div className="message-content">
                    {renderContent(message.content, contentType, isExpanded)}
                  </div>
                  
                  {/* Content Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 md:pt-2.5">
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
                    
                    <div className="flex items-center gap-2">
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
                      {/* Delete button only for AI response messages */}
                      {message.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(message)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
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
      <style>{`
        @media (max-width: 640px) {
          .mobile-spacer { height: 75px !important; }
        }
        .prose ul {
          list-style: disc !important;
          margin: 0 !important;
          margin-top: 20px !important;
          padding-left: 1.25rem !important;
        }
        .prose ol {
          list-style: decimal !important;
          margin: 0 !important;
          margin-top: 20px !important;
          padding-left: 1.25rem !important;
        }
        .prose li {
          display: list-item !important;
          margin-bottom: 0.25rem !important;
        }
      `}</style>
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-4 p-1">
          {messages.length === 0 && !isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-sm">
                Configure the additional options with the Agent Config button in the lower right hand corner.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))
          )}
          {/* Spacer to prevent overlap with bottom bar */}
          <div style={{ height: '25px' }} className="mobile-spacer" />
        </div>
      </ScrollArea>
    </div>
  )
} 