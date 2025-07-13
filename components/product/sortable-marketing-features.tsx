
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
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { MarketingFeature } from '@/lib/product-schema'

interface SortableMarketingFeaturesProps {
  features: MarketingFeature[]
  onChange: (features: MarketingFeature[]) => void
  errors?: Array<{ title?: string; description?: string }>
}

function SortableFeatureItem({ 
  feature, 
  onUpdate, 
  onRemove, 
  error 
}: { 
  feature: MarketingFeature
  onUpdate: (feature: MarketingFeature) => void
  onRemove: () => void
  error?: { title?: string; description?: string }
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? 'opacity-50' : ''}`}
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
        
        <div className="flex-1 space-y-3">
          <div>
            <Input
              placeholder="Feature title (e.g., 'Advanced Analytics')"
              value={feature.title}
              onChange={(e) => onUpdate({ ...feature, title: e.target.value })}
              className={error?.title ? 'border-red-500' : ''}
            />
            {error?.title && (
              <p className="text-sm text-red-500 mt-1">{error.title}</p>
            )}
          </div>
          
          <div>
            <Textarea
              placeholder="Feature description (optional)"
              value={feature.description || ''}
              onChange={(e) => onUpdate({ ...feature, description: e.target.value })}
              rows={2}
              className={error?.description ? 'border-red-500' : ''}
            />
            {error?.description && (
              <p className="text-sm text-red-500 mt-1">{error.description}</p>
            )}
          </div>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}

export function SortableMarketingFeatures({ 
  features, 
  onChange, 
  errors = [] 
}: SortableMarketingFeaturesProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = features.findIndex((item) => item.id === active.id)
      const newIndex = features.findIndex((item) => item.id === over?.id)
      
      const newFeatures = arrayMove(features, oldIndex, newIndex).map((feature, index) => ({
        ...feature,
        order: index
      }))
      
      onChange(newFeatures)
    }
  }

  const addFeature = () => {
    const newFeature: MarketingFeature = {
      id: `feature-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      title: '',
      description: '',
      order: features.length
    }
    onChange([...features, newFeature])
  }

  const updateFeature = (index: number, updatedFeature: MarketingFeature) => {
    const newFeatures = [...features]
    newFeatures[index] = updatedFeature
    onChange(newFeatures)
  }

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index).map((feature, i) => ({
      ...feature,
      order: i
    }))
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={features} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <SortableFeatureItem
                  key={feature.id}
                  feature={feature}
                  onUpdate={(updatedFeature) => updateFeature(index, updatedFeature)}
                  onRemove={() => removeFeature(index)}
                  error={errors[index]}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
