'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface BackdropProps {
  isVisible: boolean
  onClick: () => void
}

/**
 * Semi-transparent backdrop overlay for Nav Drawer
 * Covers entire viewport, closes drawer on click
 * Rendered via portal to body to avoid sticky/backdrop-filter containment
 */
export const Backdrop: React.FC<BackdropProps> = ({ isVisible, onClick }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isVisible) return null

  return createPortal(
    <div
      onClick={onClick}
      className={cn(
        'fixed inset-0 bg-black/50 backdrop-blur-sm z-40',
        'transition-opacity duration-300',
        'opacity-100',
      )}
      aria-hidden="true"
    />,
    document.body,
  )
}
