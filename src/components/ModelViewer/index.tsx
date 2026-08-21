'use client'

import type { Group, Texture, WebGLRenderer } from 'three'
import React, { useEffect, useRef } from 'react'

interface Props {
  onReady?: () => void
}

export const ModelViewer: React.FC<Props> = ({ onReady }) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let cleanup: () => void = () => {}

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      if (cancelled || !mountRef.current) return

      const container = mountRef.current
      const { width, height: rawHeight } = container.getBoundingClientRect()
      const height = rawHeight > 0 ? rawHeight : window.innerHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
      camera.position.set(0, 0.7, 2.2)
      camera.lookAt(0, 0, 0)

      const renderer: WebGLRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
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

      const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap })

      const loader = new GLTFLoader()
      const gltf = await new Promise<{ scene: Group }>((resolve, reject) => {
        loader.load('/model.glb', resolve as never, undefined, reject)
      })

      if (cancelled) return

      const model = gltf.scene
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = matcapMaterial
        }
      })

      onReady?.()

      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const modelSize = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z)
      scene.add(model)

      // Recomputes scale and pan whenever the canvas is resized.
      // PanX targets the visual center of the right half of the viewport,
      // derived from frustum geometry: tan(FOV/2) * cameraZ * aspect * 0.5
      // gives the world-X offset that maps to NDC x = 0.5 (75% of screen).
      const updateLayout = (w: number, h: number) => {
        const aspect = w / h
        const scaleBase = aspect < 0.8 ? 0.75 : aspect > 1.4 ? 1.05 : 0.9
        const s = (scaleBase / maxDim) * (w <= 1020 ? 0.95 : 1)
        model.scale.setScalar(s)
        const panX = w > 1020
          ? Math.tan(Math.PI / 8) * 2.2 * aspect * 0.5
          : 0
        // On mobile push the model into the bottom half so text can sit above it
        const panY = w <= 1020 ? -0.45 : 0
        model.position.set(-center.x * s + panX, -center.y * s + panY, -center.z * s)
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }

      updateLayout(width, height)

      let targetX = 0
      let targetY = 0
      let currentX = 0
      let currentY = 0

      const handleMouseMove = (e: MouseEvent) => {
        const { width: w } = container.getBoundingClientRect()
        const isMobile = w < 768
        const rangeX = isMobile ? 0.2 : 0.4
        const rangeY = isMobile ? 0.12 : 0.25
        targetX = ((e.clientX / window.innerWidth) * 2 - 1) * rangeX
        targetY = ((e.clientY / window.innerHeight) * 2 - 1) * rangeY
      }
      window.addEventListener('mousemove', handleMouseMove)

      const ro = new ResizeObserver(() => {
        if (!mountRef.current) return
        const { width: w, height: h } = mountRef.current.getBoundingClientRect()
        if (w > 0 && h > 0) updateLayout(w, h)
      })
      ro.observe(container)

      let raf: number
      const animate = () => {
        raf = requestAnimationFrame(animate)
        currentX += (targetX - currentX) * 0.1
        currentY += (targetY - currentY) * 0.1
        model.rotation.y = currentX
        model.rotation.x = currentY
        renderer.render(scene, camera)
      }
      animate()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('mousemove', handleMouseMove)
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

  return <div ref={mountRef} className="w-full h-full" />
}
