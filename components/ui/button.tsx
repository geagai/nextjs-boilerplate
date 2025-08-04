
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useButtonContext } from "./button-provider-client"
import { useTheme } from 'next-themes';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const { theme } = useTheme();
    
    // Try to get button context, but provide fallbacks if not available
    let buttonContext = null;
    try {
      buttonContext = useButtonContext();
    } catch (error) {
      // Context not available, use default styles
    }
    
    const { getButtonStyles, getButtonHoverStyles, adminSettings } = buttonContext || {
      getButtonStyles: () => ({
        backgroundColor: '#000000',
        color: '#ffffff',
        borderColor: '#000000'
      }),
      getButtonHoverStyles: () => ({
        backgroundColor: '#333333',
        color: '#ffffff'
      }),
      adminSettings: null
    };
    
    // Get custom styles based on variant and theme
    const customStyles = getButtonStyles(variant || "default");
    const customHoverStyles = getButtonHoverStyles(variant || "default");
    
    // Override with dark mode colors if available
    if (adminSettings && theme === 'dark') {
      if (variant === 'link') {
        customStyles.color = adminSettings.dark_link_color || customStyles.color;
      } else {
        customStyles.backgroundColor = adminSettings.dark_button_color || customStyles.backgroundColor;
        customStyles.color = adminSettings.dark_button_text_color || customStyles.color;
        customStyles.borderColor = adminSettings.dark_button_color || customStyles.borderColor;
      }
    }
    
    // Combine custom styles with any provided inline styles
    const combinedStyles = { ...customStyles, ...style };
    
    // Enhanced mouse event handlers for dynamic hover effects
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'link' && adminSettings) {
        const isDark = theme === 'dark';
        const linkHoverColor = isDark ? adminSettings?.dark_link_hover_color : adminSettings?.link_hover_color;
        if (linkHoverColor) {
          e.currentTarget.style.color = linkHoverColor;
        }
      } else if (customHoverStyles && typeof customHoverStyles === 'object') {
        // Override hover styles with dark mode colors if available
        let hoverStyles = { ...customHoverStyles };
        if (adminSettings && theme === 'dark') {
          hoverStyles.backgroundColor = adminSettings.dark_button_hover_color || hoverStyles.backgroundColor;
          hoverStyles.color = adminSettings.dark_button_text_color || hoverStyles.color;
        }
        
        if ('backgroundColor' in hoverStyles && typeof hoverStyles.backgroundColor === 'string') {
          e.currentTarget.style.backgroundColor = hoverStyles.backgroundColor;
        }
        if ('borderColor' in hoverStyles && typeof hoverStyles.borderColor === 'string') {
          e.currentTarget.style.borderColor = hoverStyles.borderColor;
        }
        if ('color' in hoverStyles && typeof hoverStyles.color === 'string') {
          e.currentTarget.style.color = hoverStyles.color;
        }
      }
      onMouseEnter?.(e);
    };
    
    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'link' && adminSettings) {
        const isDark = theme === 'dark';
        const linkColor = isDark ? adminSettings?.dark_link_color : adminSettings?.link_color;
        if (linkColor) {
          e.currentTarget.style.color = linkColor;
        }
      } else if (customStyles && typeof customStyles === 'object') {
        if ('backgroundColor' in customStyles && typeof customStyles.backgroundColor === 'string') {
          e.currentTarget.style.backgroundColor = customStyles.backgroundColor;
        }
        if ('borderColor' in customStyles && typeof customStyles.borderColor === 'string') {
          e.currentTarget.style.borderColor = customStyles.borderColor;
        }
        if ('color' in customStyles && typeof customStyles.color === 'string') {
          e.currentTarget.style.color = customStyles.color;
        }
      }
      onMouseLeave?.(e);
    };
    
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={combinedStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
