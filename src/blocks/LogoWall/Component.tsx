import React from 'react'
import type { LogoWallBlock as LogoWallBlockProps } from '@/payload-types'

export const LogoWallBlock: React.FC<LogoWallBlockProps> = ({ heading, subtitle, logos }) => {
  if (!logos || logos.length === 0) return null

  return (
    <section className="container py-section-gap">
      <div className="space-y-4 mb-16">
        <h2 className="font-headline-md text-headline-md text-foreground">{heading}</h2>
        {subtitle && (
          <p className="font-body-md text-body-md text-muted-foreground max-w-lg">{subtitle}</p>
        )}
      </div>

      <div
        className="grid items-center gap-8 md:gap-12"
        style={{ gridTemplateColumns: `repeat(${logos.length}, 1fr)` }}
      >
        {logos.map((logo, i) => (
          <div
            key={logo.id ?? i}
            role="img"
            aria-label={logo.label}
            title={logo.label}
            className="w-full h-7 md:h-9 relative flex items-center justify-center
              transition-all duration-300 ease-in-out
              hover:brightness-0 dark:hover:brightness-0 dark:hover:invert
              [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:block
              before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px
              before:bg-gradient-to-b before:from-neon-pink before:to-transparent
              after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px
              after:bg-gradient-to-b after:from-neon-pink after:to-transparent
              [&:not(:last-child)]:after:hidden"
            dangerouslySetInnerHTML={{ __html: logo.svg }}
          />
        ))}
      </div>
    </section>
  )
}
