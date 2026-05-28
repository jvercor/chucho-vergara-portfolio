import React from 'react'
import { Button } from '@/components/ui/button'

export const HomeHero: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center px-gutter overflow-hidden">
      {/* Atmospheric glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-russian-violet/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-dark-violet/10 rounded-full blur-[120px] -z-10" />

      {/* Hero content */}
      <div className="max-w-4xl space-y-8 z-10">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
          <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" aria-hidden="true" />
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary">
            Available for new opportunities
          </span>
        </div>
        <div className="font-headline-sm text-xl tracking-widest text-muted-foreground mb-4">
          Sr. Full-stack Engineer
        </div>
        {/* Headline */}
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground tracking-tight">
          Jesus <span className="text-neon-pink">Vergara Cortes.</span>
        </h1>

        {/* Tagline */}
        <p className="font-body-lg text-body-lg text-muted-foreground max-w-2xl mx-auto">
          I build web systems that reduce friction and drive real results — turning complex problems
          into software that helps people work smarter and make better decisions.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="clear" asChild>
            <a href="/projects">View Projects</a>
          </Button>
          <Button variant="hero-outline" size="clear" asChild>
            <a href="/contact">Get in touch</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 flex flex-col items-center gap-2 opacity-40"
        aria-hidden="true"
      >
        <span className="font-label-caps text-label-caps uppercase text-foreground">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-neon-pink to-transparent" />
      </div>
    </section>
  )
}
