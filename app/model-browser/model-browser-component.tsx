// this will list the models from the S3 bucket
// clicking one will display it in a 3D scene
import { createContext, Suspense, useState } from 'react'
import { Canvas } from "@react-three/fiber"
import { GizmoHelper, GizmoViewport, Gltf, OrbitControls, PivotControls, Stage } from '@react-three/drei'

export const SelectedModelContext = createContext<any>(null) 

export function DefaultStage(props: any){
  return (
    <>
      <Stage
        intensity={0.7}
        preset="rembrandt"
        shadows={{ type: 'accumulative', color: '#5bd8aa', colorBlend: 2, opacity: 1 }}
        adjustCamera={false}
        environment="city">
        {props.children}
      </Stage>
    </>
  );
}

export function InteractiveScene(props: any){
  const [pivotControlsEnabled, setPivotControls] = useState<boolean>(false);
  const [orbitEnabled, setOrbit] = useState<boolean>(true);

  const modelClicked = () => {
    console.log("clicked");
    setPivotControls(!pivotControlsEnabled);
  }

  const pivotDragStart = () => {
    setOrbit(false);
  }
  const pivotDragEnd = () => {
    setOrbit(true);
  }

  return(
    <>
        <OrbitControls enabled={orbitEnabled} />
        <PivotControls enabled={pivotControlsEnabled} onDragStart={pivotDragStart} onDragEnd={pivotDragEnd}>
            <Gltf 
            castShadow
            position={[0, -0.5, 0]} 
            src={`models/${props.model}`}
            onClick={modelClicked}
            /> 
        </PivotControls>
    </>
  )
}

export function ModelBrowser(){
    const [selectedModel, setSelectedModel] = useState();

    return(
        <>
            <div className='three-main-div'>          
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 90 }} frameloop="demand">
                    {/* suspense allows us to render the empty scene until the selected model is present
                    Then we re-render the scene with the gltf model attached :)
                    */}          
                    <Suspense fallback={<DefaultStage />}>
                    <DefaultStage>
                    {selectedModel ? <InteractiveScene model={selectedModel} /> : null }
                    </DefaultStage>
                    </Suspense>          
                    <GizmoHelper alignment="bottom-right" margin={[90, 90]}>
                    <GizmoViewport axisColors={['#ff4747', '#7fff47', '#4774ff']} labelColor="white" />
                    </GizmoHelper>
                </Canvas>        
            </div>
        </>
    )
}