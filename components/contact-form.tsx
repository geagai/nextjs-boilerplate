'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, MessageSquare, Send } from 'lucide-react'
import { adminSettingsCache } from '@/lib/admin-settings-cache'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  title?: string
  description?: string
  className?: string
}

export function ContactForm({ 
  title = "Send us a Message",
  description = "Fill out the form below and we'll get back to you within 24 hours.",
  className = ""
}: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [adminEmail, setAdminEmail] = useState<string>('hello@me.com')
  const [emailLoading, setEmailLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    async function fetchEmail() {
      const settings = await adminSettingsCache.getSettings();
      let email = settings?.email;
      if (!email) {
        // Try fetching fresh from DB
        const fresh = await adminSettingsCache.fetchAndCache();
        email = fresh?.email;
      }
      if (!email) email = 'hello@me.com';
      if (isMounted) setAdminEmail(email);
      if (isMounted) setEmailLoading(false);
    }
    fetchEmail();
    return () => { isMounted = false; };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for your message. We\'ll get back to you soon.'
        })
        reset()
      } else {
        toast({
          title: 'Failed to Send',
          description: result.error || 'An error occurred while sending your message',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                {...register('name')}
                placeholder="Your name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              {...register('subject')}
              placeholder="Subject (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <textarea
              {...register('message')}
              placeholder="Tell us about your project or ask us anything..."
              rows={5}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              disabled={isLoading}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          {!emailLoading && (
            <p className="text-sm text-muted-foreground">
              Or email us directly at{' '}
              <a 
                href={`mailto:${adminEmail}`}
                className="text-primary hover:underline"
              >
                {adminEmail}
              </a>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 