import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds } from '@react-three/drei'

// Loads and shows a single .glb / .gltf model.
function Gltf({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

// Self-contained 3D viewer: drag to rotate, scroll to zoom, gentle auto-spin.
// No external assets (lights only) so it works offline / on any host.
export default function Model3D({ url }) {
  return (
    <Canvas
      className="model-canvas"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <hemisphereLight intensity={0.5} groundColor="#222" />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <directionalLight position={[-5, -2, -4]} intensity={0.4} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.25}>
          <Center>
            <Gltf url={url} />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.4}
        enablePan={false}
        minDistance={1.5}
        maxDistance={12}
        makeDefault
      />
    </Canvas>
  )
}
