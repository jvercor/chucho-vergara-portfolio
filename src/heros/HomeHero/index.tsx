'use client'

import type { Group, Texture } from 'three'
import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

export const HomeHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let cleanup: () => void = () => {}

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      if (cancelled || !mountRef.current) return

      const container = mountRef.current
      const w = window.innerWidth
      const h = window.innerHeight

      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
      // Slight upward tilt so front normals sample the bright rim of the matcap
      camera.position.set(0, 1.2, 3.8)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      const textureLoader = new THREE.TextureLoader()
      const matcap = await new Promise<Texture>((resolve) => {
        textureLoader.load('/matcap.png', (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          resolve(tex)
        })
      })

      const loader = new GLTFLoader()
      const gltf = await new Promise<{ scene: Group }>((resolve, reject) => {
        loader.load('/model.glb', resolve as never, undefined, reject)
      })

      if (cancelled) return

      const model = gltf.scene

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshMatcapMaterial({ matcap })
        }
      })

      // Center and normalize scale
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1.14 / maxDim
      model.scale.setScalar(scale)
      model.position.sub(center.multiplyScalar(scale))
      model.position.y += window.innerWidth < 768 ? 0.35 : 0.71

      scene.add(model)

      // Mouse tracking state
      let targetOffsetX = 0
      let targetOffsetY = 0
      let currentOffsetX = 0
      let currentOffsetY = 0

      const handleMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1
        const ny = (e.clientY / window.innerHeight) * 2 - 1
        targetOffsetX = nx * 0.4
        targetOffsetY = ny * 0.25
      }
      window.addEventListener('mousemove', handleMouseMove)

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        model.position.y = window.innerWidth < 768 ? 0.35 : 0.71
      }
      window.addEventListener('resize', handleResize)

      let raf: number
      const animate = () => {
        raf = requestAnimationFrame(animate)
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.1
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.1
        model.rotation.y = currentOffsetX
        model.rotation.x = currentOffsetY
        renderer.render(scene, camera)
      }
      animate()

      cleanup = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center text-center px-gutter">
      {/* Layer 0 – Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Layer 1 – Atmospheric glows (desktop only, above canvas) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-russian-violet/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-dark-violet/10 rounded-full blur-[120px]" />
      </div>

      {/* Layer 2 – Hero content, vertically centered */}
      <div className="max-w-4xl space-y-8 z-10 mt-24 md:mt-44">
        {/* Headline */}
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white">
          Jesus Vergara Cortes
        </h1>

        {/* Role */}
        <h2 className="flex items-center justify-center gap-4 font-headline-sm text-headline-sm text-neon-pink">
          <span
            className="flex-1 max-w-[80px] border-t border-outline-variant"
            aria-hidden="true"
          />
          Sr. Full-stack Engineer
          <span
            className="flex-1 max-w-[80px] border-t border-outline-variant"
            aria-hidden="true"
          />
        </h2>

        {/* Tagline */}
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          I build web systems that reduce friction and drive real results — turning complex problems
          into software that helps people work smarter and make better decisions.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 z-10 flex flex-col items-center gap-2 opacity-40 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-label-caps text-label-caps uppercase text-on-surface">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-neon-pink to-transparent" />
      </div>
    </div>
  )
}
