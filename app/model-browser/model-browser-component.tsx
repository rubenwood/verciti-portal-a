import { createContext, Suspense, useState, useEffect } from 'react'
import { Canvas } from "@react-three/fiber"
import { GizmoHelper, GizmoViewport, Gltf, OrbitControls, PivotControls, Stage } from '@react-three/drei'
import { ModelEntry, ModelList } from './model-button-list-component'

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
    //setPivotControls(!pivotControlsEnabled);
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
              src={props.model}
              onClick={modelClicked}
            /> 
        </PivotControls>
    </>
  )
}

export function ModelBrowser(){
    const [selectedModel, setSelectedModel] = useState<ModelEntry>();

    useEffect(() => {
      
    }, []);

    return(
        <>
            <div className='top-left-div'>
              <div className='top-left-text'>
                <p>{ selectedModel ? ( <>Selected model: <b>{selectedModel.path}</b></> ) : `Select a model to view` }</p>
              </div>
              <ModelList onSelect={setSelectedModel} />
            </div>
            <div className='three-main-div'>
              {selectedModel ? (
                <Canvas shadows gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 5], fov: 90 }} frameloop="demand">
                    {/* suspense allows us to render the empty scene until the selected model is present
                    Then we re-render the scene with the gltf model attached :)
                    */}          
                    <Suspense fallback={<DefaultStage />}>
                      <DefaultStage>
                      {selectedModel ? <InteractiveScene model={selectedModel.url} /> : null }
                      </DefaultStage>
                    </Suspense>          
                    <GizmoHelper alignment="bottom-right" margin={[90, 90]}>
                      <GizmoViewport axisColors={['#ff4747', '#7fff47', '#4774ff']} labelColor="white" />
                    </GizmoHelper>
                </Canvas> 
              ) : null}    
            </div>
        </>
    )
}