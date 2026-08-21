'use client'

import React, { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo/Logo'

interface Props {
  ready: boolean
}

export const PageLoader: React.FC<Props> = ({ ready }) => {
  const [filled, setFilled] = useState(false)
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!ready) return
    setFilled(true)
    const fadeTimer = setTimeout(() => setFading(true), 400)
    const goneTimer = setTimeout(() => setGone(true), 900)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(goneTimer)
    }
  }, [ready])

  if (gone) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-background transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <Logo priority="high" loading="eager" variant="auto" className="w-40" />

      {/* Progress bar */}
      <div className="relative w-48 h-px bg-border/30 overflow-hidden rounded-full">
        {filled ? (
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground to-neon-pink transition-transform duration-300" />
        ) : (
          <div
            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-foreground via-foreground to-neon-pink"
            style={{ animation: 'loader-shimmer 1.4s ease-in-out infinite' }}
          />
        )}
      </div>
    </div>
  )
}
