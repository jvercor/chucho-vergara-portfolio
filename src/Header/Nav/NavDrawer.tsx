'use client'

import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { NavToggle } from './NavToggle'

interface NavDrawerProps {
  isOpen: boolean
  onClose: () => void
  data: HeaderType
  focusTrapRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Mobile navigation drawer
 * Slides in from right, 85vw width, full height
 * Contains nav links as large centered touch targets
 */
export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose, data, focusTrapRef }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  const handleLinkClick = () => {
    // Close drawer after navigation
    onClose()
  }

  return (
    <div
      ref={focusTrapRef}
      className={cn(
        'fixed inset-y-0 right-0 w-[85vw] bg-background/90 backdrop-blur-sm border-l border-border z-50',
        'flex flex-col items-center justify-center gap-6',
        'transition-transform duration-300 ease-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      {/* Close button (X) - positioned at top right */}
      <div className="absolute top-4 right-4">
        <NavToggle isOpen={isOpen} onClick={onClose} />
      </div>

      {/* Nav links - vertically stacked, centered */}
      <nav className="flex flex-col items-center gap-6">
        {navItems.map(({ link }, i) => {
          const href =
            link.type === 'reference' && typeof link.reference?.value === 'object'
              ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
              : link.url

          const isActive = pathname === href

          return (
            <div key={i} onClick={handleLinkClick}>
              <CMSLink
                {...link}
                appearance="link"
                className={cn(
                  'font-headline-sm text-headline-sm py-4 transition-colors no-underline hover:no-underline',
                  isActive ? 'text-neon-pink' : 'text-foreground hover:text-neon-pink',
                )}
              />
            </div>
          )
        })}
      </nav>
    </div>
  )
}
