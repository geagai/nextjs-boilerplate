
import { z } from 'zod'

export const marketingFeatureSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Feature title is required'),
  description: z.string().optional(),
  order: z.number()
})

export const pricingOptionSchema = z.object({
  id: z.string(),
  stripeId: z.string().optional(),
  type: z.enum(['recurring', 'one_time']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(3, 'Currency is required'),
  interval: z.enum(['month', 'year']).optional(),
  isDefault: z.boolean(),
  active: z.boolean(),
  trialPeriodDays: z.number().min(0).optional(),
  trialRequiresPaymentMethod: z.boolean().optional(),
  trialEndBehavior: z.enum(['cancel', 'create_invoice', 'continue']).optional(),
  isNew: z.boolean().optional(),
  shouldArchive: z.boolean().optional()
}).refine((data) => {
  // If it's recurring, interval is required
  if (data.type === 'recurring' && !data.interval) {
    return false
  }
  return true
}, {
  message: 'Interval is required for recurring prices',
  path: ['interval']
}).refine((data) => {
  // If trial period is set, type must be recurring
  if (data.trialPeriodDays && data.trialPeriodDays > 0 && data.type !== 'recurring') {
    return false
  }
  return true
}, {
  message: 'Trial periods are only available for recurring prices',
  path: ['trialPeriodDays']
})

export const productFormSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1, 'Product name is required').max(100, 'Product name is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  statementDescriptor: z.string().max(22, 'Statement descriptor must be 22 characters or less').optional(),
  category: z.string().optional(),
  marketingFeatures: z.array(marketingFeatureSchema),
  pricing: z.array(pricingOptionSchema).min(1, 'At least one pricing option is required'),
  taxBehavior: z.enum(['inclusive', 'exclusive', 'unspecified']),
  credits: z.number().min(0).optional(),
  creditsRollover: z.boolean().optional(),
  redirectUrl: z.string().url('Invalid redirect URL'),
  mostPopular: z.boolean(),
})

export type ProductFormData = z.infer<typeof productFormSchema>
export type MarketingFeature = z.infer<typeof marketingFeatureSchema>
export type PricingOption = z.infer<typeof pricingOptionSchema>
