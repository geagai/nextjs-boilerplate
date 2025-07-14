
'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, GripVertical, Trash2, Star, DollarSign } from 'lucide-react'
import { PricingOption } from '@/lib/product-schema'

interface SortablePricingOptionsProps {
  pricing: PricingOption[]
  onChange: (pricing: PricingOption[]) => void
  errors?: Array<{ [key: string]: string }>
}

function SortablePricingItem({ 
  pricing, 
  onUpdate, 
  onRemove, 
  onSetDefault,
  error,
  canRemove 
}: { 
  pricing: PricingOption
  onUpdate: (pricing: PricingOption) => void
  onRemove: () => void
  onSetDefault: () => void
  error?: { [key: string]: string }
  canRemove: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pricing.id })

  const style = {
    transform: typeof transform === 'string' ? transform : undefined,
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? 'opacity-50' : ''} ${pricing.isDefault ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex items-start gap-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="cursor-grab active:cursor-grabbing mt-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 space-y-4">
          {/* Header with default indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pricing.isDefault && (
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  Default
                </div>
              )}
              {!pricing.active && (
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!pricing.isDefault && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onSetDefault}
                >
                  Set as Default
                </Button>
              )}
              {canRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Price Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`type-${pricing.id}`}>Price Type</Label>
              <Select
                value={pricing.type}
                onValueChange={(value: 'recurring' | 'one_time') => 
                  onUpdate({ ...pricing, type: value, interval: value === 'one_time' ? undefined : pricing.interval || 'month' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recurring">Subscription</SelectItem>
                  <SelectItem value="one_time">One-time Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`amount-${pricing.id}`}>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`amount-${pricing.id}`}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={pricing.amount || ''}
                  onChange={(e) => onUpdate({ ...pricing, amount: parseFloat(e.target.value) || 0 })}
                  className={`pl-10 ${error?.amount ? 'border-red-500' : ''}`}
                />
              </div>
              {error?.amount && (
                <p className="text-sm text-red-500 mt-1">{error.amount}</p>
              )}
            </div>

            <div>
              <Label htmlFor={`currency-${pricing.id}`}>Currency</Label>
              <Select
                value={pricing.currency}
                onValueChange={(value) => onUpdate({ ...pricing, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="cad">CAD</SelectItem>
                  <SelectItem value="aud">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interval for recurring prices */}
          {pricing.type === 'recurring' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`interval-${pricing.id}`}>Billing Interval</Label>
                <Select
                  value={pricing.interval}
                  onValueChange={(value: 'month' | 'year') => onUpdate({ ...pricing, interval: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Trial settings for recurring prices */}
          {pricing.type === 'recurring' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Trial Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`trial-days-${pricing.id}`}>Trial Period (days)</Label>
                  <Input
                    id={`trial-days-${pricing.id}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={pricing.trialPeriodDays || ''}
                    onChange={(e) => onUpdate({ ...pricing, trialPeriodDays: parseInt(e.target.value) || undefined })}
                  />
                </div>

                {pricing.trialPeriodDays && pricing.trialPeriodDays > 0 && (
                  <>
                    <div>
                      <Label htmlFor={`trial-payment-${pricing.id}`}>Trial End Behavior</Label>
                      <Select
                        value={pricing.trialEndBehavior || 'cancel'}
                        onValueChange={(value: 'cancel' | 'create_invoice' | 'continue') => 
                          onUpdate({ ...pricing, trialEndBehavior: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cancel">Cancel subscription</SelectItem>
                          <SelectItem value="create_invoice">Create invoice</SelectItem>
                          <SelectItem value="continue">Continue subscription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`trial-requires-payment-${pricing.id}`}
                        checked={pricing.trialRequiresPaymentMethod || false}
                        onCheckedChange={(checked) => onUpdate({ ...pricing, trialRequiresPaymentMethod: checked })}
                      />
                      <Label htmlFor={`trial-requires-payment-${pricing.id}`}>
                        Require payment method for trial
                      </Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Active switch */}
          <div className="flex items-center space-x-2 border-t pt-4">
            <Switch
              id={`active-${pricing.id}`}
              checked={pricing.active}
              onCheckedChange={(checked) => onUpdate({ ...pricing, active: checked })}
            />
            <Label htmlFor={`active-${pricing.id}`}>
              Active (available for purchase)
            </Label>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function SortablePricingOptions({ 
  pricing, 
  onChange, 
  errors = [] 
}: SortablePricingOptionsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = pricing.findIndex((item) => item.id === active.id)
      const newIndex = pricing.findIndex((item) => item.id === over?.id)
      
      const newPricing = arrayMove(pricing, oldIndex, newIndex)
      onChange(newPricing)
    }
  }

  const addPricingOption = () => {
    const newPricing: PricingOption = {
      id: `pricing-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      type: 'recurring',
      amount: 0,
      currency: 'usd',
      interval: 'month',
      isDefault: pricing.length === 0, // First one is default
      active: true,
      isNew: true
    }
    onChange([...pricing, newPricing])
  }

  const updatePricing = (index: number, updatedPricing: PricingOption) => {
    const newPricing = [...pricing]
    newPricing[index] = updatedPricing
    onChange(newPricing)
  }

  const removePricing = (index: number) => {
    const newPricing = pricing.filter((_, i) => i !== index)
    
    // If we removed the default, make the first one default
    if (pricing[index].isDefault && newPricing.length > 0) {
      newPricing[0] = { ...newPricing[0], isDefault: true }
    }
    
    onChange(newPricing)
  }

  const setDefault = (index: number) => {
    const newPricing = pricing.map((p, i) => ({
      ...p,
      isDefault: i === index
    }))
    onChange(newPricing)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Pricing Options</h3>
          <p className="text-sm text-muted-foreground">
            Configure subscription or one-time pricing for your product
          </p>
        </div>
        <Button type="button" onClick={addPricingOption} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Option
        </Button>
      </div>

      {pricing.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pricing} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {pricing.map((pricingOption, index) => (
                <SortablePricingItem
                  key={pricingOption.id}
                  pricing={pricingOption}
                  onUpdate={(updatedPricing) => updatePricing(index, updatedPricing)}
                  onRemove={() => removePricing(index)}
                  onSetDefault={() => setDefault(index)}
                  error={errors[index]}
                  canRemove={pricing.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {pricing.length === 0 && (
        <Card className="border-dashed border-2 p-8 text-center">
          <p className="text-muted-foreground mb-4">No pricing options added yet</p>
          <Button type="button" onClick={addPricingOption} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Pricing Option
          </Button>
        </Card>
      )}
    </div>
  )
}
