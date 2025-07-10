"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'

interface ConditionalFooterProps {
  siteName: string
  bgColor: string
  textColor: string
  linkColor: string
  htmlOne: string | null
  htmlTwo: string | null
}

export function ConditionalFooter({ siteName, bgColor, textColor, linkColor, htmlOne, htmlTwo }: ConditionalFooterProps) {
  const pathname = usePathname()
  
  // Don't render footer on agent pages
  if (pathname.includes('/agent/')) {
    return null
  }

  return (
    <div className="mt-[100px]">
      <Footer 
        siteName={siteName} 
        bgColor={bgColor} 
        textColor={textColor} 
        linkColor={linkColor} 
        htmlOne={htmlOne} 
        htmlTwo={htmlTwo} 
      />
    </div>
  )
} 