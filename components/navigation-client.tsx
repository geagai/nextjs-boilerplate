'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, ChevronDown, Settings, MessageSquare } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase'
import { useTheme } from 'next-themes'

interface NavigationClientProps {
  user: any
  adminSettings: any
  sticky?: boolean
  siteName?: string
}

export default function NavigationClient({ user, adminSettings, sticky = true, siteName = 'Reach Them' }: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()

  // Navigation bar (show basic links even while loading)
  const baseClasses = 'z-50 border-b'
  const positionClass = sticky ? 'sticky top-0' : 'relative'



  // Custom style for Get Started button - default to white text when no admin setting
  const getStartedButtonStyle = {
    color: adminSettings?.button_text_color || adminSettings?.dark_button_text_color || '#ffffff'
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className={`${positionClass} ${baseClasses}`} style={{ backgroundColor: 'hsl(var(--header-bg))', backdropFilter: 'blur(12px)' }}>
             <div className="w-full max-w-[98%] mx-auto px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
                         <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-[1.75rem] bg-gradient-to-r from-purple-600 via-green-600 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>{siteName}</span>
          </Link>
                     {/* Middle Navigation - Home, Phone Calls, Leads, Pricing, and Admin links */}
           <div className="hidden md:flex justify-center items-center space-x-4">
             <Link href="/" className="text-link hover:text-link-hover font-medium transition-colors px-4">
               Home
             </Link>
             <Link href="/ai-call" className="text-link hover:text-link-hover font-medium transition-colors px-4">
               Phone Calls
             </Link>
             <Link href="/ai-sms" className="text-link hover:text-link-hover font-medium transition-colors px-4">
               SMS
             </Link>
             <Link href="/ai-email" className="text-link hover:text-link-hover font-medium transition-colors px-4">
               Email
             </Link>
             <div className="relative group">
               <button className="text-link hover:text-link-hover font-medium transition-colors px-4 flex items-center space-x-1">
                 <span>Leads</span>
                 <ChevronDown className="h-4 w-4" />
               </button>
               <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                 <Link href="/leads" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md">
                   Find Leads
                 </Link>
                 <Link href="/my-leads" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-md">
                   My Leads
                 </Link>
               </div>
             </div>
             <Link href="/pricing" className="text-link hover:text-link-hover font-medium transition-colors px-4">
               Pricing
             </Link>
             <Link href="/contact" className="text-link hover:text-link-hover font-medium transition-colors px-4">
               Contact
             </Link>
            {user?.role === 'admin' && (
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
                    <Link href="/my-products" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>My Products</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/create-product-stripe" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Create Product</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/admin-submissions" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Contact Submissions</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                                 <Link href="/dashboard">
                   <Button 
                     size="sm" 
                     variant="outline"
                     style={{ 
                       backgroundColor: 'transparent',
                       borderColor: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)',
                       color: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)'
                     }}
                   >
                     Dashboard
                   </Button>
                 </Link>
              </>
            )}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: theme === 'dark' ? 'var(--dark-secondary)' : 'var(--secondary)',
                  color: theme === 'dark' ? 'var(--dark-link)' : 'var(--link)'
                }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)',
                      color: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)'
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90" style={getStartedButtonStyle}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
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
             <Link href="/" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               Home
             </Link>
             <Link href="/ai-call" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               Phone Calls
             </Link>
             <Link href="/ai-sms" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               SMS
             </Link>
             <Link href="/ai-email" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               Email
             </Link>
             <div className="px-4 py-2">
               <div className="text-link font-medium mb-2">Leads</div>
               <div className="ml-4 space-y-2">
                 <Link href="/leads" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors py-1">
                   Find Leads
                 </Link>
                 <Link href="/my-leads" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors py-1">
                   My Leads
                 </Link>
               </div>
             </div>
             <Link href="/pricing" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               Pricing
             </Link>
             <Link href="/settings" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               Settings
             </Link>
             <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
               Contact
             </Link>
            {user?.role === 'admin' && (
              <Link href="/admin-settings" onClick={() => setIsOpen(false)} className="block text-link hover:text-link-hover font-medium transition-colors px-4 py-2">
                Admin
              </Link>
            )}
            {user && (
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block pt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full py-2"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)',
                    color: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)'
                  }}
                >
                  Dashboard
                </Button>
              </Link>
            )}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full py-2"
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: theme === 'dark' ? 'var(--dark-secondary)' : 'var(--secondary)',
                  color: theme === 'dark' ? 'var(--dark-link)' : 'var(--link)'
                }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <div className="my-2.5">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full py-2"
                      style={{ 
                        backgroundColor: 'transparent',
                        borderColor: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)',
                        color: theme === 'dark' ? 'var(--dark-primary)' : 'var(--primary)'
                      }}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
                <div className="my-2.5">
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button 
                      size="sm" 
                      className="w-full py-2" 
                      style={{
                        backgroundColor: adminSettings?.primary_color || adminSettings?.button_color || '#3872BB',
                        color: adminSettings?.button_text_color || '#ffffff'
                      }}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
} 