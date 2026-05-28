import React from 'react'

export const HomeHero: React.FC = () => {
  return (
    <section className="relative min-h-[921px] flex flex-col items-center justify-center text-center px-gutter overflow-hidden">
      {/* Atmospheric glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-russian-violet/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-dark-violet/10 rounded-full blur-[120px] -z-10" />

      {/* Hero content */}
      <div className="max-w-4xl space-y-8 z-10">
        {/* Headline */}
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white tracking-tight">
          Jesus Vergara Cortes
        </h1>

        {/* Role */}
        <h2 className="flex items-center justify-center gap-4 font-headline-sm text-headline-sm text-neon-pink">
          <span className="flex-1 max-w-[80px] border-t border-outline-variant" aria-hidden="true" />
          Sr. Full-stack Engineer
          <span className="flex-1 max-w-[80px] border-t border-outline-variant" aria-hidden="true" />
        </h2>

        {/* Tagline */}
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          I build web systems that reduce friction and drive real results — turning complex problems
          into software that helps people work smarter and make better decisions.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
        <span className="font-label-caps text-label-caps uppercase text-on-surface">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-neon-pink to-transparent" />
      </div>
    </section>
  )
}
