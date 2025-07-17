
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Globe, MapPin, Building, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const ipSchema = z.object({
  ip: z.string().min(1, 'IP address is required')
})

type IPFormData = z.infer<typeof ipSchema>

interface IPInfo {
  ip: string
  country?: string
  region?: string
  city?: string
  timezone?: string
  isp?: string
  organization?: string
  as?: string
}

export function IPLookupTool() {
  const [isLoading, setIsLoading] = useState(false)
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IPFormData>({
    resolver: zodResolver(ipSchema)
  })

  const onSubmit = async (data: IPFormData) => {
    setIsLoading(true)
    setIpInfo(null)

    try {
      const response = await fetch('/api/mcp/ip-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip: data.ip })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIpInfo(result.data)
        toast({
          title: 'IP Lookup Successful',
          description: `Information retrieved for ${result.data.ip}`
        })
      } else {
        throw new Error(result.error || 'Failed to lookup IP')
      }
    } catch (error) {
      toast({
        title: 'Lookup Failed',
        description: error instanceof Error ? error.message : 'An error occurred during IP lookup',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-primary" />
          IP Lookup Tool
        </CardTitle>
        <CardDescription>
          Demonstration of the MCP server integration. Enter an IP address to get geolocation information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
          <div className="flex-1">
            <Input
              {...register('ip')}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              disabled={isLoading}
            />
            {errors.ip && (
              <p className="text-sm text-destructive mt-1">{errors.ip.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        {ipInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">IP Address:</span>
                  <Badge variant="outline">{ipInfo.ip}</Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm">
                    {[ipInfo.city, ipInfo.region, ipInfo.country]
                      .filter(Boolean)
                      .join(', ') || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Timezone:</span>
                  <span className="text-sm">{ipInfo.timezone || 'Unknown'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">ISP:</span>
                  <span className="text-sm">{ipInfo.isp || 'Unknown'}</span>
                </div>

                <div className="flex items-start space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm text-muted-foreground">Organization:</span>
                    <p className="text-sm break-words">{ipInfo.organization || 'Unknown'}</p>
                  </div>
                </div>

                {ipInfo.as && (
                  <div className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-sm text-muted-foreground">AS Number:</span>
                      <p className="text-sm break-words">{ipInfo.as}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">About this Tool</h4>
          <p className="text-sm text-muted-foreground">
            This IP lookup tool demonstrates the MCP (Model Context Protocol) server integration. 
            It shows how external APIs can be integrated into your NextGeag BP application for enhanced functionality.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
