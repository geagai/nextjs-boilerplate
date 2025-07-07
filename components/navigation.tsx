
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

  // Navigation bar (show basic links even while loading)
  return (
    <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'hsl(var(--header-bg))', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-secondary" />
            <span className="font-bold text-xl text-primary">NextGeag BP</span>
          </Link>
          {/* Middle Navigation - Home, Pricing, and Admin links */}
          <div className="hidden md:flex justify-center items-center space-x-4">
            <Link href="/" className="text-link hover:text-link-hover font-medium transition-colors px-4">
              Home
            </Link>
            <Link href="/pricing" className="text-link hover:text-link-hover font-medium transition-colors px-4">
              Pricing
            </Link>
            {(!loading && user?.role === 'admin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-link hover:text-link-hover font-medium transition-colors px-4 flex items-center space-x-1">
                    <span>Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/admin-settings" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Admin Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create-product-stripe" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Create Product</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ThemeToggle />
            {!loading && user && (
              <>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button size="sm" variant="outline">
                    Settings
                  </Button>
                </Link>
              </>
            )}
            {!loading && user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <>
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
              </>
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
            {!loading && user?.role === 'admin' && (
              <Link href="/admin-settings" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
                Admin
              </Link>
            )}
            {!loading && user && (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <Button size="sm" variant="outline" className="w-full">
                    Settings
                  </Button>
                </Link>
              </>
            )}
            {!loading && user ? (
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
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
