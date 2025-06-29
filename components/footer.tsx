
import Link from 'next/link'
import { Code2, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">NextGeag BP</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The ultimate Next.js 15 boilerplate for enterprise-grade applications.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:hello@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="https://nextjs.org/docs" 
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/#contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link 
                  href="/#features" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 NextGeag BP. Built with ❤️ for developers.
          </p>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            Powered by Next.js 15, React 19, and modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  )
}
