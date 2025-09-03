"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'
import { useTheme } from 'next-themes'

interface ConditionalFooterProps {
  siteName: string
  bgColor: string
  textColor: string
  linkColor: string
  bgColorDark?: string
  textColorDark?: string
  linkColorDark?: string
  htmlOne: string | null
  htmlTwo: string | null
}

export function ConditionalFooter({ siteName, bgColor, textColor, linkColor, bgColorDark, textColorDark, linkColorDark, htmlOne, htmlTwo }: ConditionalFooterProps) {
  const pathname = usePathname()
  const { theme } = useTheme();
  // Don't render footer on agent pages
  if (pathname?.includes('/agent/') ?? false) {
    return null
  }
  const isDark = theme === 'dark';
  const footerBg = isDark ? (bgColorDark || bgColor) : bgColor;
  const footerText = isDark ? (textColorDark || textColor) : textColor;
  const footerLink = isDark ? (linkColorDark || linkColor) : linkColor;
  return (
    <Footer 
      siteName={siteName} 
      bgColor={footerBg} 
      textColor={footerText} 
      linkColor={footerLink} 
      htmlOne={htmlOne} 
      htmlTwo={htmlTwo} 
    />
  )
} 