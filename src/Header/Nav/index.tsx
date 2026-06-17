'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/ui'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        const href =
          link.type === 'reference' && typeof link.reference?.value === 'object'
            ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
            : link.url

        const isActive = pathname === href

        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={cn(
              'transition-colors no-underline hover:no-underline',
              isActive ? 'text-neon-pink' : 'text-foreground hover:text-neon-pink',
            )}
          />
        )
      })}
    </nav>
  )
}
