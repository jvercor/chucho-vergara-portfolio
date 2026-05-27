'use client'

import React, { useEffect, useRef } from 'react'

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
      const matcap = await new Promise<THREE.Texture>((resolve) => {
        textureLoader.load('/matcap.png', (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          resolve(tex)
        })
      })

      const loader = new GLTFLoader()
      const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
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
      const scale = 1.45 / maxDim
      model.scale.setScalar(scale)
      model.position.sub(center.multiplyScalar(scale))
      model.position.y += 0.55

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Layer 1 – Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Layer 3 – identity card */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end items-center pointer-events-none px-6 pb-16 lg:pb-24">
        <div className="w-full max-w-xl space-y-4 pointer-events-auto">
          <div className="rounded-sm border border-white/10 hover:border-white/20 transition-colors p-8 backdrop-blur-sm bg-black/40">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 text-stone-200 tracking-tight">
              Jesus Vergara
            </h1>
            <p className="text-lg text-stone-300">Sr. Full Stack Engineer at Engrain</p>

            <div className="mt-12">
              <ul className="flex gap-5">
                <li>
                  <a
                    href="https://www.linkedin.com/in/jvergarac/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-300 hover:text-stone-100 transition-colors"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/ChuchoVergara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-300 hover:text-stone-100 transition-colors"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                    </svg>
                    <span className="sr-only">Twitter/X @ChuchoVergara</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/jvercor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-300 hover:text-stone-100 transition-colors"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span className="sr-only">GitHub @jvercor</span>
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-sm text-stone-400/60">Socials</p>
            </div>
          </div>

          <div>
            <p className="text-center text-stone-400/60">I&apos;ll add some cool stuff here later</p>
          </div>
        </div>
      </div>
    </div>
  )
}
