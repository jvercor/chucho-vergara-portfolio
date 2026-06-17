'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

interface NavToggleProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

/**
 * Hamburger menu button that animates to X when open
 * 24px icon in 40x40px tap target
 */
export const NavToggle: React.FC<NavToggleProps> = ({ isOpen, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-10 h-10 flex flex-col items-center justify-center gap-[6px] text-foreground hover:text-neon-pink transition-colors',
        className,
      )}
      aria-label="Toggle navigation"
      aria-expanded={isOpen}
    >
      {/* Top line */}
      <span
        className={cn(
          'w-6 h-0.5 bg-current transition-transform duration-300 ease-out',
          isOpen && 'translate-y-[8px] rotate-45',
        )}
      />
      {/* Middle line */}
      <span
        className={cn(
          'w-6 h-0.5 bg-current transition-opacity duration-300 ease-out',
          isOpen && 'opacity-0',
        )}
      />
      {/* Bottom line */}
      <span
        className={cn(
          'w-6 h-0.5 bg-current transition-transform duration-300 ease-out',
          isOpen && '-translate-y-[8px] -rotate-45',
        )}
      />
    </button>
  )
}
