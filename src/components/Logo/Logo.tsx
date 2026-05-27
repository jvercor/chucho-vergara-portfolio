'use client'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/providers/Theme'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'auto' | 'white' | 'black'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, variant = 'auto' } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const src =
    variant === 'white'
      ? '/logo-white.svg'
      : variant === 'black'
        ? '/logo-black.svg'
        : mounted && theme === 'dark'
          ? '/logo-white.svg'
          : '/logo-black.svg'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={src}
      suppressHydrationWarning
    />
  )
}
