import { cn } from '../lib/utils'
import { ImgHTMLAttributes, forwardRef } from 'react'

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', shape = 'circle', ...props }, ref) => {
    const sizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    }

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-lg',
    }

    const [hasError, setHasError] = React.useState(false)

    if (!src || hasError) {
      return (
        <div
          ref={ref}
          className={cn('inline-flex items-center justify-center font-medium bg-muted text-muted-foreground', sizes[size], shapes[shape], className)}
          aria-label={alt || fallback}
          {...props}
        >
          {fallback || '?'}
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || fallback || ''}
        className={cn('inline-block object-cover', sizes[size], shapes[shape], className)}
        onError={() => setHasError(true)}
        {...props}
      />
    )
  }
)

Avatar.displayName = 'Avatar'

// AvatarGroup for stacked avatars
export interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  className?: string
}

export function AvatarGroup({ children, max = 5, className }: AvatarGroupProps) {
  const kids = React.Children.toArray(children).slice(0, max)
  const overflow = React.Children.count(children) - max

  return (
    <div className={cn('flex -space-x-2', className)} aria-label={`${kids.length} avatars`}>
      {kids.map((child, i) => {
        const element = child as React.ReactElement<any>
        return React.cloneElement(element, {
          key: element.key ?? i,
          className: cn(element.props?.className, 'ring-2 ring-background'),
        })
      })}
      {overflow > 0 && (
        <div className={cn('inline-flex items-center justify-center font-medium bg-muted text-muted-foreground ring-2 ring-background', 'h-10 w-10 text-sm rounded-full')}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

import React from 'react'