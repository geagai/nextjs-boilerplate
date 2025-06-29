
import Stripe from 'stripe'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

const products = [
  {
    name: 'NextGeag BP - Starter',
    description: 'Starter plan with basic features for small projects',
    price: 1000, // $10.00 in cents
    priceKey: 'STARTER',
  },
  {
    name: 'NextGeag BP - Pro',
    description: 'Pro plan with advanced features for growing businesses',
    price: 2000, // $20.00 in cents
    priceKey: 'PRO',
  },
  {
    name: 'NextGeag BP - Elite',
    description: 'Elite plan with all features for enterprise teams',
    price: 3000, // $30.00 in cents
    priceKey: 'ELITE',
  },
]

async function setupStripeProducts() {
  console.log('Setting up Stripe products and prices...')
  
  const priceIds: Record<string, string> = {}

  for (const productData of products) {
    try {
      // Create product
      console.log(`Creating product: ${productData.name}`)
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        metadata: {
          plan: productData.priceKey,
        },
      })

      // Create price
      console.log(`Creating price for ${productData.name}`)
      const price = await stripe.prices.create({
        unit_amount: productData.price,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: product.id,
        metadata: {
          plan: productData.priceKey,
        },
      })

      priceIds[productData.priceKey] = price.id
      console.log(`✅ Created ${productData.priceKey}: ${price.id}`)
    } catch (error) {
      console.error(`❌ Error creating ${productData.priceKey}:`, error)
    }
  }

  console.log('\n📋 Price IDs for your .env file:')
  Object.entries(priceIds).forEach(([key, priceId]) => {
    console.log(`STRIPE_${key}_PRICE_ID="${priceId}"`)
  })

  console.log('\n✅ Stripe setup complete!')
  return priceIds
}

if (require.main === module) {
  setupStripeProducts().catch(console.error)
}

export { setupStripeProducts }
