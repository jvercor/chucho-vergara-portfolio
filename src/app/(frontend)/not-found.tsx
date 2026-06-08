import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Atmospheric glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-russian-violet/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-dark-violet/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl space-y-8 z-10">
        <Logo className="max-w-[200px] h-auto mx-auto" priority="high" />

        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground tracking-tight">
          <span className="text-neon-pink">404</span>
        </h1>

        <p className="font-body-lg text-body-lg text-muted-foreground">Page not found.</p>

        <div className="pt-4">
          <Button variant="primary" size="clear" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
