
import React from 'react'

interface FooterProps {
  siteName: string
  bgColor: string
  textColor: string
  linkColor: string
  htmlOne: string | null
  htmlTwo: string | null
}

export function Footer({ siteName, bgColor, textColor, linkColor, htmlOne, htmlTwo }: FooterProps) {
  return (
    <footer style={{ backgroundColor: bgColor, color: textColor }} className="pt-12 pb-8 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col space-y-2 text-sm">
          <span>&copy; {new Date().getFullYear()} {siteName}</span>
          <a href="/privacy-policy" style={{ color: linkColor }} className="hover:underline">Privacy Policy</a>
          <a href="/terms-service" style={{ color: linkColor }} className="hover:underline">Terms of Service</a>
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlOne || '' }} />
        <div dangerouslySetInnerHTML={{ __html: htmlTwo || '' }} />
      </div>
    </footer>
  )
}
