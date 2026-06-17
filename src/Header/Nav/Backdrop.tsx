'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

interface BackdropProps {
  isVisible: boolean
  onClick: () => void
}

/**
 * Semi-transparent backdrop overlay for Nav Drawer
 * Covers entire viewport, closes drawer on click
 */
export const Backdrop: React.FC<BackdropProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null

  return (
    <div
      onClick={onClick}
      className={cn(
        'fixed inset-0 bg-black/50 backdrop-blur-sm z-40',
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      aria-hidden="true"
    />
  )
}
