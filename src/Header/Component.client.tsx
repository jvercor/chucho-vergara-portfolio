'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo3D } from '@/components/Logo/Logo3D'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-20 w-full transition-colors duration-300',
        scrolled
          ? 'bg-background/90 backdrop-blur-sm border-b border-border'
          : 'bg-transparent',
      )}
    >
      <div className="container">
        <div className="py-4 flex justify-between">
          <Link href="/">
            <Logo3D size={64} />
          </Link>
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
