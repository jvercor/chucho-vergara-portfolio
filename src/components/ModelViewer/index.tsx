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
      const height = rawHeight > 0 ? rawHeight : window.innerHeight * 0.45

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

      onReady?.()
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const modelSize = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z)
      const isMobile = window.innerWidth < 768
      const scaleBase = isMobile ? 1.2 : 1.4
      const scale = scaleBase / maxDim
      model.scale.setScalar(scale)
      model.position.sub(center.multiplyScalar(scale))
      scene.add(model)

      let targetX = 0
      let targetY = 0
      let currentX = 0
      let currentY = 0

      const handleMouseMove = (e: MouseEvent) => {
        const rangeX = isMobile ? 0.2 : 0.4
        const rangeY = isMobile ? 0.12 : 0.25
        targetX = ((e.clientX / window.innerWidth) * 2 - 1) * rangeX
        targetY = ((e.clientY / window.innerHeight) * 2 - 1) * rangeY
      }
      window.addEventListener('mousemove', handleMouseMove)

      const ro = new ResizeObserver(() => {
        if (!mountRef.current) return
        const { width: w, height: h } = mountRef.current.getBoundingClientRect()
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
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
