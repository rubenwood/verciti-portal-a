'use client'
import { Canvas } from '@react-three/fiber'
import { Gltf, OrbitControls, Bounds } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
import { useBounds } from '@react-three/drei'
import { Group } from 'three'

type ModelEntry = {
  path: string
  url: string
}

function FitBoundsModel({ url }: { url: string }) {
  const ref = useRef<Group>(null)
  const bounds = useBounds()

  useEffect(() => {
    if (ref.current) {
      bounds.refresh(ref.current).fit()
    }
  }, [url])

  return <Gltf ref={ref} src={url} />
}

export function ModelPreview({ model }: { model: ModelEntry }) {
  return (
    <div className="w-48 flex flex-col items-center p-2 bg-gray-100 rounded">
      {/* Canvas wrapper: keep full width, no fixed height */}
      <div className="w-full">
        <Canvas camera={{ position: [2, 2, 2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <FitBoundsModel url={model.url} />
            </Bounds>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate autoRotate />
        </Canvas>
      </div>
    </div>
  )
}

