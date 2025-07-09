
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useAdminSettings } from "@/components/admin-settings-provider"

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
    const { getButtonStyles, getButtonHoverStyles } = useAdminSettings();
    
    // Get custom styles based on variant
    const customStyles = getButtonStyles(variant || "default");
    const customHoverStyles = getButtonHoverStyles(variant || "default");
    
    // Combine custom styles with any provided inline styles
    const combinedStyles = { ...customStyles, ...style };
    
    // Enhanced mouse event handlers for dynamic hover effects
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Apply custom hover styles if available
      if (customHoverStyles.backgroundColor) {
        e.currentTarget.style.backgroundColor = customHoverStyles.backgroundColor;
      }
      if (customHoverStyles.borderColor) {
        e.currentTarget.style.borderColor = customHoverStyles.borderColor;
      }
      if (customHoverStyles.color) {
        e.currentTarget.style.color = customHoverStyles.color;
      }
      
      // Call the original onMouseEnter if provided
      onMouseEnter?.(e);
    };
    
    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Restore normal styles
      if (customStyles.backgroundColor) {
        e.currentTarget.style.backgroundColor = customStyles.backgroundColor;
      }
      if (customStyles.borderColor) {
        e.currentTarget.style.borderColor = customStyles.borderColor;
      }
      if (customStyles.color) {
        e.currentTarget.style.color = customStyles.color;
      }
      
      // Call the original onMouseLeave if provided
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
