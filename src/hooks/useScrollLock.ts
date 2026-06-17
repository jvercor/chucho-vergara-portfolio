import { useEffect } from 'react'

/**
 * Hook to lock body scroll when active
 * Applies overflow-hidden to body element to prevent background scrolling
 * Useful for modals, drawers, and overlays
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    // Store original overflow value
    const originalOverflow = document.body.style.overflow

    // Lock scroll
    document.body.style.overflow = 'hidden'

    // Cleanup: restore original overflow
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isLocked])
}
