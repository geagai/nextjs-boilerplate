'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useAdminSettings } from '@/components/admin-settings-provider'
import { useTheme } from 'next-themes'
import { Loader2, Search } from 'lucide-react'
import { SocialMediaIcons } from '@/components/social-media-icons'

const leadsSchema = z.object({
  businessType: z.string().min(1, 'Business type is required'),
  location: z.string().min(1, 'Location is required'),
  radius: z.number().min(1, 'Radius must be at least 1').max(100, 'Radius must be 100 or less')
})

type LeadsFormData = z.infer<typeof leadsSchema>

export function LeadsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { adminSettings, loading: adminSettingsLoading, clearCacheAndRefresh } = useAdminSettings()
  const { theme } = useTheme()

  // Force refresh admin settings on mount
  React.useEffect(() => {
    if (!adminSettings && !adminSettingsLoading) {
      clearCacheAndRefresh()
    }
  }, [adminSettings, adminSettingsLoading, clearCacheAndRefresh])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LeadsFormData>({
    resolver: zodResolver(leadsSchema)
  })

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchParams, setSearchParams] = useState<any>(null)
  const [savingLeads, setSavingLeads] = useState<Set<string>>(new Set())
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSavingContacts, setIsSavingContacts] = useState(false)
  const [isSavingAll, setIsSavingAll] = useState(false)

  const onSubmit = async (data: LeadsFormData) => {
    setIsLoading(true)
    setHasSearched(true)
    setSelectedContacts(new Set()) // Reset selections for new search

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setSearchResults(result.results || [])
        setSearchParams(result.searchParams)
        setNextPageToken(result.nextPageToken)
        toast({
          title: 'Search Completed!',
          description: `Found ${result.totalResults} businesses matching your criteria.`
        })
      } else {
        toast({
          title: 'Search Failed',
          description: result.error || 'An error occurred while searching for leads',
          variant: 'destructive'
        })
        setSearchResults([])
        setNextPageToken(null)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
      setSearchResults([])
      setNextPageToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSelection = (placeId: string, checked: boolean) => {
    setSelectedContacts(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(placeId)
      } else {
        newSet.delete(placeId)
      }
      return newSet
    })
  }

  const loadMoreResults = async () => {
    if (!nextPageToken || !searchParams) return

    setIsLoadingMore(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessType: searchParams.businessType,
          location: searchParams.location,
          radius: searchParams.radius,
          pageToken: nextPageToken
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSearchResults(prev => [...prev, ...(result.results || [])])
        setNextPageToken(result.nextPageToken)
        toast({
          title: 'More Results Loaded!',
          description: `Added ${result.totalResults} more businesses to your search.`
        })
      } else {
        toast({
          title: 'Load More Failed',
          description: result.error || 'An error occurred while loading more results',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading more results',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleSaveLead = async (business: any) => {
    if (!searchParams) return

    setSavingLeads(prev => new Set(prev).add(business.place_id))

    try {
      const response = await fetch('/api/leads/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          place_id: business.place_id,
          business_name: business.name,
          formatted_address: business.formatted_address,
          formatted_phone_number: business.formatted_phone_number,
          website: business.website,
          rating: business.rating,
          user_ratings_total: business.user_ratings_total,
          price_level: business.price_level,
          business_status: business.business_status,
          business_types: business.types,
          search_business_type: searchParams.businessType,
          search_location: searchParams.location,
          search_radius: searchParams.radius,
          search_coordinates: searchParams.coordinates
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Lead Saved!',
          description: `${business.name} has been saved to your leads.`
        })
      } else {
        if (response.status === 409) {
          toast({
            title: 'Already Saved',
            description: `${business.name} is already in your leads.`,
            variant: 'default'
          })
        } else if (response.status === 401) {
          toast({
            title: 'Login Required',
            description: 'You must be logged in to save leads. Please sign in and try again.',
            variant: 'destructive'
          })
        } else {
          toast({
            title: 'Save Failed',
            description: result.error || 'Failed to save lead',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving the lead',
        variant: 'destructive'
      })
    } finally {
      setSavingLeads(prev => {
        const newSet = new Set(prev)
        newSet.delete(business.place_id)
        return newSet
      })
    }
  }

  const handleSaveSelectedContacts = async () => {
    if (!searchParams || selectedContacts.size === 0) return

    setIsSavingContacts(true)
    const selectedBusinesses = searchResults.filter(business => selectedContacts.has(business.place_id))
    
    try {
      const promises = selectedBusinesses.map(async (business) => {
        const response = await fetch('/api/leads/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            place_id: business.place_id,
            business_name: business.name,
            formatted_address: business.formatted_address,
            formatted_phone_number: business.formatted_phone_number,
            website: business.website,
            rating: business.rating,
            user_ratings_total: business.user_ratings_total,
            price_level: business.price_level,
            business_status: business.business_status,
            business_types: business.types,
            search_business_type: searchParams.businessType,
            search_location: searchParams.location,
            search_radius: searchParams.radius,
            search_coordinates: searchParams.coordinates
          })
        })

        const result = await response.json()
        return { business, response, result }
      })

      const results = await Promise.all(promises)
      
      const savedCount = results.filter(r => r.response.ok).length
      const alreadySavedCount = results.filter(r => r.response.status === 409).length
      const failedCount = results.filter(r => !r.response.ok && r.response.status !== 409).length

      if (savedCount > 0) {
        toast({
          title: 'Contacts Saved!',
          description: `Successfully saved ${savedCount} contact${savedCount > 1 ? 's' : ''} to your leads.`
        })
      }

      if (alreadySavedCount > 0) {
        toast({
          title: 'Some Already Saved',
          description: `${alreadySavedCount} contact${alreadySavedCount > 1 ? 's were' : ' was'} already in your leads.`,
          variant: 'default'
        })
      }

      if (failedCount > 0) {
        toast({
          title: 'Some Failed to Save',
          description: `${failedCount} contact${failedCount > 1 ? 's' : ''} failed to save.`,
          variant: 'destructive'
        })
      }

             // Clear selections after saving
       setSelectedContacts(new Set())

     } catch (error) {
       toast({
         title: 'Error',
         description: 'An unexpected error occurred while saving contacts',
         variant: 'destructive'
       })
     } finally {
       setIsSavingContacts(false)
          }
   }

   const handleSaveAll = async () => {
     if (!searchParams || searchResults.length === 0) return

     setIsSavingAll(true)
     
     try {
       const promises = searchResults.map(async (business) => {
         const response = await fetch('/api/leads/save', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             place_id: business.place_id,
             business_name: business.name,
             formatted_address: business.formatted_address,
             formatted_phone_number: business.formatted_phone_number,
             website: business.website,
             rating: business.rating,
             user_ratings_total: business.user_ratings_total,
             price_level: business.price_level,
             business_status: business.business_status,
             business_types: business.types,
             search_business_type: searchParams.businessType,
             search_location: searchParams.location,
             search_radius: searchParams.radius,
             search_coordinates: searchParams.coordinates
           })
         })

         const result = await response.json()
         return { business, response, result }
       })

       const results = await Promise.all(promises)
       
       const savedCount = results.filter(r => r.response.ok).length
       const alreadySavedCount = results.filter(r => r.response.status === 409).length
       const failedCount = results.filter(r => !r.response.ok && r.response.status !== 409).length

       if (savedCount > 0) {
         toast({
           title: 'All Contacts Saved!',
           description: `Successfully saved ${savedCount} contact${savedCount > 1 ? 's' : ''} to your leads.`
         })
       }

       if (alreadySavedCount > 0) {
         toast({
           title: 'Some Already Saved',
           description: `${alreadySavedCount} contact${alreadySavedCount > 1 ? 's were' : ' was'} already in your leads.`,
           variant: 'default'
         })
       }

       if (failedCount > 0) {
         toast({
           title: 'Some Failed to Save',
           description: `${failedCount} contact${failedCount > 1 ? 's' : ''} failed to save.`,
           variant: 'destructive'
         })
       }

     } catch (error) {
       toast({
         title: 'Error',
         description: 'An unexpected error occurred while saving all contacts',
         variant: 'destructive'
       })
     } finally {
       setIsSavingAll(false)
     }
   }

   return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-primary" />
            Search for Leads
          </CardTitle>
          <CardDescription>
            Enter your search criteria to find business leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                {...register('businessType')}
                placeholder="Business type"
                disabled={isLoading}
              />
              {errors.businessType && (
                <p className="text-sm text-destructive">{errors.businessType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  {...register('location')}
                  placeholder="Location"
                  disabled={isLoading}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  {...register('radius', { valueAsNumber: true })}
                  type="number"
                  placeholder="Radius (miles)"
                  disabled={isLoading}
                />
                {errors.radius && (
                  <p className="text-sm text-destructive">{errors.radius.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Leads
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

             {/* Save All and Save Selected Contacts Buttons */}
       {hasSearched && searchResults.length > 0 && (
         <div className="mt-4 flex justify-between">
           <Button
             onClick={handleSaveAll}
             disabled={isSavingAll}
             className="px-6"
                           style={{
                backgroundColor: theme === 'dark' ? adminSettings?.dark_secondary_color || '#374151' : adminSettings?.secondary_color || '#f3f4f6',
                color: theme === 'dark' ? adminSettings?.dark_button_text_color || '#ffffff' : adminSettings?.button_text_color || '#000000'
              }}
           >
             {isSavingAll ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Saving All...
               </>
             ) : (
               `Save All (${searchResults.length})`
             )}
           </Button>
           <Button
             onClick={handleSaveSelectedContacts}
             disabled={selectedContacts.size === 0 || isSavingContacts}
             className="px-6"
           >
             {isSavingContacts ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Saving...
               </>
             ) : (
               `Save Contacts (${selectedContacts.size})`
             )}
           </Button>
         </div>
       )}

      {/* Search Results */}
      {hasSearched && (
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Search Results
              </CardTitle>
              <CardDescription>
                {isLoading 
                  ? 'Searching for businesses...'
                  : searchResults.length > 0 
                    ? `${searchResults.length} businesses found` 
                    : 'No businesses found matching your criteria'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Searching for businesses...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    {nextPageToken && ' (more available)'}
                  </div>
                  <div className="space-y-4">
                    {searchResults.map((business, index) => (
                      <div key={business.place_id || index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{business.name}</h3>
                            {business.formatted_address && (
                              <p className="text-muted-foreground text-sm mt-1">
                                📍 {business.formatted_address}
                              </p>
                            )}
                            {business.formatted_phone_number && (
                              <p className="text-muted-foreground text-sm mt-1">
                                📞 {business.formatted_phone_number}
                              </p>
                            )}
                            {business.rating && (
                              <div className="flex items-center mt-2">
                                <span className="text-sm text-muted-foreground mr-2">
                                  ⭐ {business.rating}/5
                                </span>
                                {business.user_ratings_total && (
                                  <span className="text-sm text-muted-foreground">
                                    ({business.user_ratings_total} reviews)
                                  </span>
                                )}
                              </div>
                            )}
                            {business.website && (
                              <a 
                                href={business.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm mt-2 inline-block"
                              >
                                🌐 Visit Website
                              </a>
                            )}
                            <div className="mt-[15px]">
                              <Button
                                onClick={() => handleSaveLead(business)}
                                disabled={savingLeads.has(business.place_id)}
                                size="sm"
                                className="max-w-[300px]"
                              >
                                {savingLeads.has(business.place_id) ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  'Save Lead'
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <Checkbox
                              checked={selectedContacts.has(business.place_id)}
                              onCheckedChange={(checked) => handleContactSelection(business.place_id, checked as boolean)}
                            />
                            {business.price_level && (
                              <span className="text-sm text-muted-foreground">
                                {'💰'.repeat(business.price_level)}
                              </span>
                            )}
                            {business.is_saved && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Saved
                              </span>
                            )}
                                                         {business.business_status && (
                               <span className={`text-xs px-2 py-1 rounded-full ${
                                 business.business_status === 'OPERATIONAL' 
                                   ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                   : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                               }`}>
                                 {business.business_status === 'OPERATIONAL' ? 'Active Business' : business.business_status}
                               </span>
                             )}
                                                           <SocialMediaIcons businessName={business.name} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {nextPageToken && (
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={loadMoreResults}
                        disabled={isLoadingMore}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading More...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            Load More Results
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No businesses found. Try adjusting your search criteria.</p>
                </div>
              )}
            </CardContent>
                     </Card>
           
           {/* Save All and Save Selected Contacts Buttons Below Results */}
           {hasSearched && searchResults.length > 0 && (
             <div className="mt-4 flex justify-between">
               <Button
                 onClick={handleSaveAll}
                 disabled={isSavingAll}
                 className="px-6"
                                   style={{
                    backgroundColor: theme === 'dark' ? adminSettings?.dark_secondary_color || '#374151' : adminSettings?.secondary_color || '#f3f4f6',
                    color: theme === 'dark' ? adminSettings?.dark_button_text_color || '#ffffff' : adminSettings?.button_text_color || '#000000'
                  }}
               >
                 {isSavingAll ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving All...
                   </>
                 ) : (
                   `Save All (${searchResults.length})`
                 )}
               </Button>
               <Button
                 onClick={handleSaveSelectedContacts}
                 disabled={selectedContacts.size === 0 || isSavingContacts}
                 className="px-6"
               >
                 {isSavingContacts ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   `Save Contacts (${selectedContacts.size})`
                 )}
               </Button>
             </div>
           )}
         </div>
       )}
     </div>
   )
 }
