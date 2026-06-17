'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo3D } from '@/components/Logo/Logo3D'
import { HeaderNav } from './Nav'
import { NavToggle } from './Nav/NavToggle'
import { NavDrawer } from './Nav/NavDrawer'
import { Backdrop } from './Nav/Backdrop'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [scrolled, setScrolled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Drawer handlers
  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev)

  // Accessibility hooks
  useScrollLock(isDrawerOpen)
  const focusTrapRef = useFocusTrap(isDrawerOpen, closeDrawer)

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
        <div className="py-4 flex justify-between items-center">
          <Link href="/">
            <Logo3D size={64} />
          </Link>

          {/* Desktop Nav - visible on md and up */}
          <div className="hidden md:block">
            <HeaderNav data={data} />
          </div>

          {/* Mobile Nav Toggle - visible below md */}
          <div className="md:hidden">
            <NavToggle isOpen={isDrawerOpen} onClick={toggleDrawer} />
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer and Backdrop */}
      <Backdrop isVisible={isDrawerOpen} onClick={closeDrawer} />
      <NavDrawer isOpen={isDrawerOpen} onClose={closeDrawer} data={data} focusTrapRef={focusTrapRef} />
    </header>
  )
}
