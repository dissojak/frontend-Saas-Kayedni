import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@global/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-shadow duration-300 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        skeuo: "bg-background text-foreground shadow-skeuo hover:shadow-skeuo-inner active:shadow-skeuo-inner rounded-xl font-bold",
        "skeuo-primary": "bg-primary text-primary-foreground shadow-[4px_4px_10px_0px_rgba(0,0,0,0.2),-4px_-4px_10px_0px_rgba(255,255,255,0.2)] hover:shadow-[inner_4px_4px_10px_0px_rgba(0,0,0,0.2),inner_-4px_-4px_10px_0px_rgba(255,255,255,0.2)] rounded-xl font-bold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-xl px-10 text-lg",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }),"cursor-pointer")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
