'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'

interface SimpleMarketingFeaturesProps {
  features: string[]
  onChange: (features: string[]) => void
  errors?: string[]
}

export function SimpleMarketingFeatures({ 
  features, 
  onChange, 
  errors = [] 
}: SimpleMarketingFeaturesProps) {
  const addFeature = () => {
    onChange([...features, ''])
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    onChange(newFeatures)
  }

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index)
    onChange(newFeatures)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Marketing Features</h3>
          <p className="text-sm text-muted-foreground">
            Add key features that will be displayed to customers
          </p>
        </div>
        <Button type="button" onClick={addFeature} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {features.length > 0 && (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Textarea
                    placeholder={`Feature ${index + 1} (e.g., 'Advanced Analytics with Real-time Insights')`}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    rows={2}
                    className={errors[index] ? 'border-red-500' : ''}
                  />
                  {errors[index] && (
                    <p className="text-sm text-red-500 mt-1">{errors[index]}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {features.length === 0 && (
        <Card className="border-dashed border-2 p-8 text-center">
          <p className="text-muted-foreground mb-4">No marketing features added yet</p>
          <Button type="button" onClick={addFeature} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Feature
          </Button>
        </Card>
      )}
    </div>
  )
} 