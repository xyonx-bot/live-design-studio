import { forwardRef, isValidElement, cloneElement, type ReactElement } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  asChild?: boolean
}

/**
 * Square-minimal button — squarish corners, flat surfaces, precise hover states.
 */
const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
  outline: 'border border-border text-foreground hover:border-foreground/40 hover:bg-foreground/[0.04]',
  ghost: 'text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  default: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
  icon: 'h-9 w-9',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium tracking-tight transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-40',
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild && isValidElement(props.children)) {
      const child = props.children as ReactElement<any>
      return cloneElement(
        child,
        { ...props, className: cn(classes, child.props.className) },
        child.props.children
      )
    }

    return <button ref={ref} className={classes} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }
export default Button
