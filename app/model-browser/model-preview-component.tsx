'use client'
import { Canvas } from '@react-three/fiber'
import { Gltf, OrbitControls, Bounds, useBounds, Stage } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
import { Group } from 'three'
import { ModelLoading } from './model-loading-component'

type ModelEntry = {
  path: string
  url: string
}

function PreviewModel({ url }: { url: string }) {
  const ref = useRef<Group>(null)
  const bounds = useBounds()

// code to fit bounds, not sure it works
//   useEffect(() => {
//     if (ref.current) {
//       bounds.refresh(ref.current).fit()
//     }
//   }, [url])

  return (
    <Stage 
        intensity={0.7}
        preset="rembrandt"
        adjustCamera={false}>
        <Gltf ref={ref} src={url} />
    </Stage>
  )
}

export function ModelPreview({ model }: { model: ModelEntry }) {
  return (
    <div className="w-48 flex flex-col items-center p-2 bg-gray-100 rounded">
      <div className="w-full">
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 2], fov: 90 }} dpr={[1, 2]} frameloop="demand">
          <ambientLight />
          <Suspense fallback={<ModelLoading />}>
            <PreviewModel url={model.url} />
            {/* <Bounds fit clip observe margin={1.2}>
              <PreviewModel url={model.url} />
            </Bounds> */}
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate autoRotate />
        </Canvas>
      </div>
    </div>
  )
}

