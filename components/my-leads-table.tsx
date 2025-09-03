'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ExternalLink, Star, Edit, Trash2, Loader2, Check, X, RefreshCw } from 'lucide-react'
import { LeadsFilter } from '@/components/leads-filter'
import { SocialMediaIcons } from '@/components/social-media-icons'

interface Lead {
  id: string
  business_name: string
  formatted_phone_number?: string
  formatted_address?: string
  website?: string
  email?: string
  rating?: number
  user_ratings_total?: number
  contacted_email?: boolean
  contacted_text?: boolean
  contacted_call?: boolean
  notes?: string
  created_at: string
}

interface MyLeadsTableProps {
  leads: Lead[]
}

export function MyLeadsTable({ leads }: MyLeadsTableProps) {
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingContacted, setUpdatingContacted] = useState<string | null>(null)
  const [gettingEmail, setGettingEmail] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<{ keyword: string; city: string; state: string }>({ keyword: '', city: '', state: '' })
  const { toast } = useToast()

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setIsDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingLead) return

    setIsEditing(true)
    try {
      const response = await fetch(`/api/leads/${editingLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: editingLead.business_name,
          formatted_phone_number: editingLead.formatted_phone_number,
          formatted_address: editingLead.formatted_address,
          website: editingLead.website,
          email: editingLead.email,
          notes: editingLead.notes,
        }),
      })

      if (response.ok) {
        setLocalLeads(prev => 
          prev.map(lead => 
            lead.id === editingLead.id ? editingLead : lead
          )
        )
                 toast({
           title: 'Lead Updated',
           description: 'The lead has been successfully updated.',
         })
         setEditingLead(null)
         setIsDialogOpen(false)
      } else {
        const error = await response.json()
        toast({
          title: 'Update Failed',
          description: error.error || 'Failed to update lead',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while updating the lead.',
        variant: 'destructive',
      })
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async (leadId: string) => {
    setIsDeleting(leadId)
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLocalLeads(prev => prev.filter(lead => lead.id !== leadId))
        toast({
          title: 'Lead Deleted',
          description: 'The lead has been successfully removed.',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Delete Failed',
          description: error.error || 'Failed to delete lead',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the lead.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleContacted = async (leadId: string, field: 'contacted_email' | 'contacted_text' | 'contacted_call') => {
    const lead = localLeads.find(l => l.id === leadId)
    if (!lead) return

    const newValue = !lead[field]
    const updateKey = `${leadId}-${field}`
    
    setUpdatingContacted(updateKey)
    
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [field]: newValue,
        }),
      })

      if (response.ok) {
        setLocalLeads(prev => 
          prev.map(l => 
            l.id === leadId ? { ...l, [field]: newValue } : l
          )
        )
        toast({
          title: 'Contact Status Updated',
          description: `${field.replace('contacted_', '').charAt(0).toUpperCase() + field.replace('contacted_', '').slice(1)} contact status updated.`,
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Update Failed',
          description: error.error || 'Failed to update contact status',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while updating contact status.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingContacted(null)
    }
  }

  const handleGetEmail = async (leadId: string) => {
    setGettingEmail(leadId)
    
    try {
      const response = await fetch('/api/leads/get-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update the local state with the new email
        setLocalLeads(prev => 
          prev.map(lead => 
            lead.id === leadId ? { ...lead, email: data.email } : lead
          )
        )

        if (data.email) {
          toast({
            title: 'Email Found',
            description: `Email address found: ${data.email}`,
          })
        } else {
          toast({
            title: 'Email Not Found',
            description: 'No email address found for this business.',
            variant: 'destructive',
          })
        }
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to get email address.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while getting the email address.',
        variant: 'destructive',
      })
    } finally {
      setGettingEmail(null)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLocalLeads(data.leads || [])
        toast({
          title: 'Leads Refreshed',
          description: 'Your leads have been successfully refreshed.',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Refresh Failed',
          description: error.error || 'Failed to refresh leads.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while refreshing leads.',
        variant: 'destructive',
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleFilter = async (filters: { keyword: string; city: string; state: string }) => {
    setIsFiltering(true)
    setCurrentFilters(filters)
    
    try {
      const params = new URLSearchParams()
      if (filters.keyword) params.append('keyword', filters.keyword)
      if (filters.city) params.append('city', filters.city)
      if (filters.state) params.append('state', filters.state)

      const response = await fetch(`/api/leads?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLocalLeads(data.leads || [])
        toast({
          title: 'Filter Applied',
          description: `Found ${data.leads?.length || 0} leads matching your criteria.`,
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Filter Failed',
          description: error.error || 'Failed to apply filters.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while filtering leads.',
        variant: 'destructive',
      })
    } finally {
      setIsFiltering(false)
    }
  }

  const handleClearFilters = async () => {
    setIsFiltering(true)
    setCurrentFilters({ keyword: '', city: '', state: '' })
    
    try {
      const response = await fetch('/api/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLocalLeads(data.leads || [])
        toast({
          title: 'Filters Cleared',
          description: 'All filters have been cleared.',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to clear filters.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while clearing filters.',
        variant: 'destructive',
      })
    } finally {
      setIsFiltering(false)
    }
  }

  if (localLeads.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>No Leads Found</CardTitle>
          <CardDescription>
            You haven't saved any leads yet. Start by searching for businesses on the Leads page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Visit the <a href="/leads" className="text-primary hover:underline">Leads page</a> to search for and save business leads.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <LeadsFilter
        onFilter={handleFilter}
        onClear={handleClearFilters}
        isLoading={isFiltering}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Saved Leads</CardTitle>
              <CardDescription>
                {localLeads.length} lead{localLeads.length !== 1 ? 's' : ''} saved
                {currentFilters.keyword || currentFilters.city || currentFilters.state ? (
                  <span className="ml-2 text-blue-600">
                    (filtered)
                  </span>
                ) : null}
              </CardDescription>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isFiltering}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
                         <TableHeader>
               <TableRow>
                 <TableHead>Email</TableHead>
                 <TableHead>Text</TableHead>
                                   <TableHead>Call</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                 <TableHead>Website</TableHead>
                 <TableHead>Rating</TableHead>
                                   <TableHead>Reviews</TableHead>
                 <TableHead>Notes</TableHead>
                 <TableHead>Actions</TableHead>
               </TableRow>
             </TableHeader>
            <TableBody>
                             {localLeads.map((lead) => (
                 <TableRow key={lead.id}>
                                       <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleContacted(lead.id, 'contacted_email')}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                        disabled={updatingContacted === `${lead.id}-contacted_email`}
                      >
                        {updatingContacted === `${lead.id}-contacted_email` ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-600" />
                        ) : lead.contacted_email ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )}
                      </button>
                    </TableCell>
                                       <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleContacted(lead.id, 'contacted_text')}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                        disabled={updatingContacted === `${lead.id}-contacted_text`}
                      >
                        {updatingContacted === `${lead.id}-contacted_text` ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-600" />
                        ) : lead.contacted_text ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )}
                      </button>
                    </TableCell>
                                       <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleContacted(lead.id, 'contacted_call')}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                        disabled={updatingContacted === `${lead.id}-contacted_call`}
                      >
                        {updatingContacted === `${lead.id}-contacted_call` ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-600" />
                        ) : lead.contacted_call ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )}
                      </button>
                    </TableCell>
                                       <TableCell className="font-medium">
                      <div>
                        <div>{lead.business_name}</div>
                        <div className="mt-1">
                          <SocialMediaIcons businessName={lead.business_name} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {lead.email && lead.email !== "not found grok" ? (
                        <span className="text-sm">{lead.email}</span>
                      ) : lead.email === "not found grok" ? (
                        <span className="text-sm text-gray-500">Not Found</span>
                      ) : (
                        <button
                          onClick={() => handleGetEmail(lead.id)}
                          disabled={gettingEmail === lead.id}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {gettingEmail === lead.id ? (
                            <>
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              Getting...
                            </>
                          ) : (
                            'Get Email'
                          )}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap min-w-[140px]">
                      {lead.formatted_phone_number || 'N/A'}
                    </TableCell>
                                                                           <TableCell className="whitespace-nowrap min-w-[200px]">
                      {lead.formatted_address ? lead.formatted_address.replace(', USA', '') : 'N/A'}
                    </TableCell>
                                     <TableCell className="whitespace-nowrap min-w-[120px]">
                     {lead.website ? (
                       <a
                         href={lead.website}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-primary hover:underline flex items-center gap-1"
                       >
                         Visit Website
                         <ExternalLink className="h-3 w-3" />
                       </a>
                     ) : (
                       'N/A'
                     )}
                   </TableCell>
                  <TableCell>
                    {lead.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{lead.rating}</span>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.user_ratings_total ? (
                      <span>{lead.user_ratings_total.toLocaleString()}</span>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {lead.notes ? (
                      <div className="truncate" title={lead.notes}>
                        {lead.notes}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No notes</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                                             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                         <DialogTrigger asChild>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleEdit(lead)}
                             className="h-8 w-8 p-0"
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                         </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Lead</DialogTitle>
                            <DialogDescription>
                              Update the information for {lead.business_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                                                         <div className="grid grid-cols-4 items-center gap-4">
                               <Label htmlFor="business_name" className="text-right">
                                 Business Name
                               </Label>
                               <Input
                                 id="business_name"
                                 value={editingLead?.business_name || ''}
                                 onChange={(e) => setEditingLead(prev => prev ? {...prev, business_name: e.target.value} : null)}
                                 className="col-span-3"
                               />
                             </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                               <Label htmlFor="email" className="text-right">
                                 Email
                               </Label>
                               <Input
                                 id="email"
                                 value={editingLead?.email || ''}
                                 onChange={(e) => setEditingLead(prev => prev ? {...prev, email: e.target.value} : null)}
                                 className="col-span-3"
                               />
                             </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                               <Label htmlFor="phone" className="text-right">
                                 Phone
                               </Label>
                               <Input
                                 id="phone"
                                 value={editingLead?.formatted_phone_number || ''}
                                 onChange={(e) => setEditingLead(prev => prev ? {...prev, formatted_phone_number: e.target.value} : null)}
                                 className="col-span-3"
                               />
                             </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="address" className="text-right">
                                Address
                              </Label>
                              <Input
                                id="address"
                                value={editingLead?.formatted_address || ''}
                                onChange={(e) => setEditingLead(prev => prev ? {...prev, formatted_address: e.target.value} : null)}
                                className="col-span-3"
                              />
                            </div>
                                                                                       <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="website" className="text-right">
                                  Website
                                </Label>
                                <Input
                                  id="website"
                                  value={editingLead?.website || ''}
                                  onChange={(e) => setEditingLead(prev => prev ? {...prev, website: e.target.value} : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">
                                  Notes
                                </Label>
                                <Textarea
                                  id="notes"
                                  value={editingLead?.notes || ''}
                                  onChange={(e) => setEditingLead(prev => prev ? {...prev, notes: e.target.value} : null)}
                                  className="col-span-3"
                                  placeholder="Add notes about this lead..."
                                />
                              </div>
                          </div>
                                                     <div className="flex justify-end gap-2">
                             <Button
                               onClick={handleSaveEdit}
                               disabled={isEditing}
                             >
                               {isEditing ? (
                                 <>
                                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                   Saving...
                                 </>
                               ) : (
                                 'Save Changes'
                               )}
                             </Button>
                                                           <button
                                type="button"
                                onClick={() => setIsDialogOpen(false)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
                                style={{
                                  backgroundColor: '#991b1b',
                                  color: '#ffffff',
                                  border: '1px solid #991b1b'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#7f1d1d';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#991b1b';
                                }}
                              >
                                Cancel
                              </button>
                           </div>
                        </DialogContent>
                      </Dialog>
                                             <button
                         type="button"
                         onClick={() => handleDelete(lead.id)}
                         disabled={isDeleting === lead.id}
                         className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0"
                         style={{
                           backgroundColor: '#991b1b',
                           color: '#ffffff',
                           border: '1px solid #991b1b'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.backgroundColor = '#7f1d1d';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.backgroundColor = '#991b1b';
                         }}
                       >
                         {isDeleting === lead.id ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                         ) : (
                           <Trash2 className="h-4 w-4" />
                         )}
                       </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                 </div>
       </CardContent>
     </Card>
   </div>
   )
 }
