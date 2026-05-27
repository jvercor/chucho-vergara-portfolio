'use client'

import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useTheme } from '..'

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
      className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors"
      suppressHydrationWarning
    >
      {mounted && (theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      ))}
    </button>
  )
}
