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
      <div className="container py-6">
        {/* Main row: logo left, controls right */}
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center" href="/">
            <Logo variant="white" />
          </Link>

          <div className="flex items-center gap-4">
            {navItems.length > 0 && (
              <nav className="hidden md:flex flex-row gap-4">
                {navItems.map(({ link }, i) => (
                  <CMSLink className="text-white" key={i} {...link} />
                ))}
              </nav>
            )}

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

            <ThemeSelector />
          </div>
        </div>

        {/* Mobile-only micro-strip: nav links */}
        {navItems.length > 0 && (
          <div className="mt-4 flex md:hidden flex-row flex-wrap justify-center gap-x-4 gap-y-1">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-white/70 text-xs" key={i} {...link} />
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
