import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '700'] })

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { defaultTheme, themeLocalStorageKey } from '@/providers/Theme/shared'
import { themeIsValid } from '@/providers/Theme/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cookies, draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get(themeLocalStorageKey)?.value ?? null
  const theme = themeIsValid(themeCookie) ? themeCookie : defaultTheme

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, inter.variable)}
      data-theme={theme}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
