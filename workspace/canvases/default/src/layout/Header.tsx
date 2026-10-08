import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navigation?: React.ReactNode
  actions?: React.ReactNode
  sticky?: boolean
  variant?: 'default' | 'bordered' | 'elevated'
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, logo, navigation, actions, sticky = false, variant = 'default', ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'flex items-center justify-between px-6 py-4',
          'transition-shadow duration-200',
          sticky && 'fixed top-0 left-0 right-0 z-50',
          variant === 'default' && 'bg-background/80 backdrop-blur-sm',
          variant === 'bordered' && 'bg-background border-b',
          variant === 'elevated' && 'bg-background shadow-md',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-8 flex-1">
          <div className="flex-shrink-0">{logo}</div>
          <nav className="flex-1 flex justify-center">{navigation}</nav>
          <div className="flex items-center gap-4 justify-end flex-shrink-0">{actions}</div>
        </div>
      </header>
    )
  }
)
Header.displayName = 'Header'

export { Header }