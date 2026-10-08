import { forwardRef, isValidElement, cloneElement, type ReactElement } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2',
  ghost: 'hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2',
  link: 'text-primary underline-offset-4 hover:underline h-10 px-4 py-2',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: '',
  sm: 'h-10 px-3 text-xs',
  lg: 'h-11 rounded-md px-8 text-base',
  icon: 'h-10 w-10',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild && isValidElement(props.children)) {
      const child = props.children as ReactElement<any>
      return cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      })
    }

    return <button ref={ref} className={classes} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }
