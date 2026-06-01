import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import type { Footer as FooterType } from '@/payload-types'

const SOCIAL_ICONS: Record<
  NonNullable<NonNullable<FooterType['socialLinks']>[number]['platform']>,
  IconDefinition
> = {
  github: faGithub,
  linkedin: faLinkedin,
  x: faXTwitter,
}

const SOCIAL_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
}

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo variant="white" />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          {socialLinks.length > 0 && (
            <div className="flex flex-row gap-3 items-center">
              {socialLinks.map(({ platform, url, id }) => {
                const icon = SOCIAL_ICONS[platform]
                if (!icon) return null
                return (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[platform] ?? platform}
                    className="text-white hover:opacity-70 transition-opacity duration-200"
                  >
                    <FontAwesomeIcon icon={icon} className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          )}
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
