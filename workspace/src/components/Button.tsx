import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2': variant === 'destructive',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2': variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2': variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline h-10 px-4 py-2': variant === 'link',
            'h-10 px-3 text-xs': size === 'sm',
            'h-11 rounded-md px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }