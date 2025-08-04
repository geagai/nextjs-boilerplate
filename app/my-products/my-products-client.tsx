'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import ClearProductCacheButton from '@/components/clear-product-cache-button'

interface PriceInfo {
  id: string
  amount: number | null
  currency: string
  type: 'recurring' | 'one_time'
  interval: string | null
}

interface ProductRow {
  id: string
  name: string
  image: string | null
  metadata: Record<string, unknown> // TODO: Replace 'unknown' with a more specific type if possible
  prices: PriceInfo[]
}

interface Props {
  products: ProductRow[]
  devMode: boolean
}

export default function MyProductsClient({ products, devMode }: Props) {
  const formattedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      credits: Number(p.metadata?.credits ?? 0),
    }))
  }, [products])

  const formatPrice = (price: PriceInfo) => {
    if (price.amount === null) return '-'
    const amount = (price.amount / 100).toFixed(2)
    if (price.type === 'one_time') return `$${amount} ${price.currency.toUpperCase()} one-time`
    return `$${amount} ${price.currency.toUpperCase()} / ${price.interval}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <ClearProductCacheButton />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white shadow-sm">
          <thead className="bg-muted text-sm font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Prices</th>
              <th className="px-4 py-3 text-left">Credits</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {formattedProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">
                  <Image
                    src={product.image || '/icon-white.png'}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 font-medium">{product.name}</td>
                <td className="px-4 py-2 space-y-1">
                  {product.prices.length === 0 ? (
                    <span className="text-muted-foreground">No prices</span>
                  ) : (
                    product.prices.map((price) => (
                      <div key={price.id}>{formatPrice(price)}</div>
                    ))
                  )}
                </td>
                <td className="px-4 py-2">{product.credits}</td>
                <td className="px-4 py-2">
                  <a
                    href={`/edit-product-stripe?id=${product.id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                  >
                    Edit Product
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {devMode && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Stripe API Response (dev mode)</h2>
          <pre className="bg-muted p-4 overflow-auto text-sm rounded-md">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 