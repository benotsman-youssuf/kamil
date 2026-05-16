import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button — unified design language matching the dark charcoal pill style.
 *
 * Primary:    deep charcoal bg, cream text  (the "signup" look)
 * Secondary:  warm muted bg, dark text
 * Outline:    transparent with border
 * Ghost:      no bg, subtle hover
 * Destructive: warm red
 */
const buttonVariants = cva(
  // Base — all buttons share these traits
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium",
    "rounded-lg",                           // 8px — consistent with --radius
    "transition-all duration-150 ease-out",
    "disabled:pointer-events-none disabled-opacity-40",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "active:scale-[0.97]",                  // micro-press feedback
  ].join(" "),
  {
    variants: {
      variant: {
        // Deep charcoal — the hero style (like the signup button)
        default: [
          "bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:bg-primary/85 hover:shadow-md",
        ].join(" "),

        // Warm secondary
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/70",
        ].join(" "),

        // Outline — border + transparent
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "dark:border-border dark:hover:bg-accent/40",
        ].join(" "),

        // Ghost — invisible until hovered
        ghost: [
          "text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "dark:hover:bg-accent/60",
        ].join(" "),

        // Destructive
        destructive: [
          "bg-destructive text-white",
          "hover:bg-destructive/85",
          "focus-visible:ring-destructive/40",
        ].join(" "),

        // Text link
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 px-3 text-xs",
        lg:      "h-11 px-6 text-base",
        icon:    "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
