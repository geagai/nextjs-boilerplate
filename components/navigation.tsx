
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, Code2, ChevronDown, Settings } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  // Handle loading state
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">NextGeag BP</span>
            </Link>
            
            {/* Show basic navigation while loading */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Subscribe
              </Link>
              <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled>
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Sign Out
                </Button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const navigation = user 
    ? [
        { name: 'Subscribe', href: '/pricing' },
        { name: 'Settings', href: '/settings' }
      ]
    : [
        { name: 'Features', href: '/#features' },
        { name: 'Subscribe', href: '/pricing' },
        { name: 'Contact', href: '/#contact' }
      ]

  const isAdmin = user?.role === 'admin'

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">NextGeag BP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Menu - Only visible to admin users */}
            {user && isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                    <span>Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/create-product-stripe" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Create Product</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* New Admin Settings link */}
                  <DropdownMenuItem asChild>
                    <Link href="/admin-settings" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Admin Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link href="/dashboard">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Menu for Mobile - Only visible to admin users */}
            {user && isAdmin && (
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-foreground mb-2">Admin</div>
                <Link
                  href="/create-product-stripe"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors pl-4"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Create Product</span>
                </Link>
                {/* New Admin Settings link for mobile */}
                <Link
                  href="/admin-settings"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors pl-4"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Settings</span>
                </Link>
              </div>
            )}
            
            {user ? (
              <div className="pt-4 border-t space-y-4">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
