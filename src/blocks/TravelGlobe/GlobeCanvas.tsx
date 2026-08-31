'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export interface GlobeTravelPoint {
  id: string
  lat: number
  lon: number
  countryLabel: string
  photo: MediaType | number
}

interface Props {
  travels: GlobeTravelPoint[]
}

// Neon-pink / dark-theme design tokens, expressed as 0-1 RGB for cobe.
const MARKER_COLOR: [number, number, number] = [1, 0.004, 0.984]
const GLOW_COLOR: [number, number, number] = [1, 0.004, 0.984]
const BASE_COLOR: [number, number, number] = [0.16, 0.16, 0.16]

const THETA = 0.3

// Controls how close to the globe's edge a photo card fades out.
// `dot` is ~1 when a point faces the viewer head-on, ~0 exactly at the edge
// (the terminator), and negative on the far side.
// FADE_START: cards are fully opaque above this dot value.
// FADE_END: cards are fully invisible below this dot value.
// Raise both to make cards disappear earlier (further from the edge);
// lower both to let them linger closer to — or past — the edge.
const FADE_START = 0.2
const FADE_END = -0.05

const toRad = (deg: number) => (deg * Math.PI) / 180

// Same lat/lon -> unit-sphere mapping cobe uses internally.
const latLonToVector3 = (lat: number, lon: number): [number, number, number] => {
  const r = toRad(lat)
  const a = toRad(lon) - Math.PI
  const cosR = Math.cos(r)
  return [-cosR * Math.cos(a), Math.sin(r), cosR * Math.sin(a)]
}

// Same phi/theta rotation cobe applies, reduced to the viewer-facing (z) component.
const facingDot = (vec: [number, number, number], phi: number, theta: number) => {
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const [x, y, z] = vec
  return -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export const GlobeCanvas: React.FC<Props> = ({ travels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [anchorSupported, setAnchorSupported] = useState(false)

  useEffect(() => {
    setAnchorSupported(
      typeof CSS !== 'undefined' && CSS.supports('position-anchor: --cobe-travel-globe'),
    )
  }, [])

  useEffect(() => {
    let destroyed = false
    let globe: { update: (state: Record<string, unknown>) => void; destroy: () => void } | undefined
    let phi = 0
    let width = 0
    // Clamp DPR to 2 — cobe internally does `canvas.width = width * devicePixelRatio`,
    // so requesting anything higher just quadratic-scales GPU cost with no visible gain.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const onResize = () => {
      width = container.offsetWidth
      globe?.update({ width: width * dpr, height: width * dpr })
    }
    window.addEventListener('resize', onResize)
    onResize()

    const points = travels.map((t) => ({ id: t.id, vec: latLonToVector3(t.lat, t.lon) }))

    let frameId: number
    // Pause the render loop entirely while the globe is scrolled off-screen so the
    // GPU/CPU aren't kept busy re-drawing something the user can't see.
    let isVisible = true

    const init = async () => {
      const { default: createGlobe } = await import('cobe')

      if (destroyed || !canvas) return

      globe = createGlobe(canvas, {
        // NOTE: `width`/`height` here are already the final physical pixel size
        // (CSS width * dpr) — do NOT also multiply by 2, cobe multiplies internally
        // by `devicePixelRatio` again, which previously produced a 4x-oversized
        // (16x the pixel count) render target and needlessly taxed the GPU every frame.
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: 0,
        theta: THETA,
        dark: 1,
        diffuse: 1.2,
        scale: 1,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: BASE_COLOR,
        markerColor: MARKER_COLOR,
        glowColor: GLOW_COLOR,
        markerElevation: 0,
        markers: travels.map((t) => ({
          location: [t.lat, t.lon] as [number, number],
          size: 0.05,
          id: t.id,
        })),
      })

      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry?.isIntersecting ?? true
        },
        { threshold: 0 },
      )
      observer.observe(container)

      // Auto-rotates the globe continuously; no drag interaction.
      const animate = () => {
        if (isVisible) {
          phi += 0.003
          globe?.update({ phi, width: width * dpr, height: width * dpr })

          // Drive each photo card's opacity ourselves so the fade-out distance
          // from the globe's edge is tunable (see FADE_START/FADE_END above),
          // instead of relying on cobe's built-in binary front/back visibility.
          for (const p of points) {
            const dot = facingDot(p.vec, phi, THETA)
            const opacity = clamp01((dot - FADE_END) / (FADE_START - FADE_END))
            const el = cardRefs.current[p.id]
            if (el) el.style.opacity = String(opacity)
          }
        }

        frameId = requestAnimationFrame(animate)
      }
      frameId = requestAnimationFrame(animate)

      return () => observer.disconnect()
    }

    let cleanupObserver: (() => void) | undefined
    void init().then((cleanup) => {
      if (destroyed) cleanup?.()
      else cleanupObserver = cleanup
    })

    return () => {
      destroyed = true
      window.removeEventListener('resize', onResize)
      if (frameId) cancelAnimationFrame(frameId)
      cleanupObserver?.()
      globe?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travels])

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-[520px] mx-auto"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
      />
      {anchorSupported &&
        travels.map((t) => (
          <div
            key={t.id}
            ref={(el) => {
              cardRefs.current[t.id] = el
            }}
            className="glass-card border border-border/40 bg-card/80 neon-glow-pink rounded-lg overflow-hidden w-20 h-14 md:w-24 md:h-16 pointer-events-none"
            style={
              {
                position: 'absolute',
                positionAnchor: `--cobe-${t.id}`,
                bottom: 'calc(anchor(top) + 10px)',
                left: 'anchor(center)',
                transform: 'translateX(-50%) rotate(-2deg)',
                opacity: 0,
              } as React.CSSProperties
            }
          >
            {typeof t.photo === 'object' && (
              <Media
                fill
                imgClassName="object-cover"
                resource={t.photo}
                // Cards render at ~80-96px CSS width; without an explicit `size`,
                // <Media> falls back to full-breakpoint sizes (up to ~1920w),
                // making next/image fetch far larger images than this tiny card needs.
                size="(min-width: 768px) 192px, 160px"
              />
            )}
          </div>
        ))}
    </div>
  )
}
