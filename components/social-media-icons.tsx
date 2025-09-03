import { Linkedin, Facebook } from 'lucide-react'

interface SocialMediaIconsProps {
  businessName: string
  className?: string
}

export function SocialMediaIcons({ businessName, className = "" }: SocialMediaIconsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(businessName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors"
        title={`Search for ${businessName} employees on LinkedIn`}
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        href={`https://www.facebook.com/search/people/?q=${encodeURIComponent(businessName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-800 hover:text-blue-900 transition-colors"
        title={`Search for ${businessName} on Facebook`}
      >
        <Facebook className="h-5 w-5" />
      </a>
    </div>
  )
}
