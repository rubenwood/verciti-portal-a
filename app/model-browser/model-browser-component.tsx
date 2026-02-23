import { createContext, Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, Vector3 } from "@react-three/fiber"
import { GizmoHelper, GizmoViewport, Gltf, Html, OrbitControls, PivotControls, Stage } from '@react-three/drei'
import { ModelEntry, ModelList } from './model-button-list-component'
import { MBTextModelButton } from './model-browser-text-modal'

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

export function HTMLModal(props: any) {

  return (
    <Html
      position={props.position}
      center
      occlude={props.gltfRef}>
      <div className="bg-white p-4 rounded shadow-lg">
        <p className="text-sm"><b>Name:</b> {props.name}</p>
        <br />
        <MBTextModelButton />
      </div>
    </Html>
  )
}

export function InteractiveScene(props: any){
  const gltfRef = useRef<any>(null);
  const [pivotControlsEnabled, setPivotControls] = useState<boolean>(false);
  const [orbitEnabled, setOrbit] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    position: Vector3,
    name: string,
    uuid: string
  } | null>(null)

  useEffect(() => {
    console.log("Model URL in InteractiveScene:", props.model);
  }, [props.model]);

  const modelClicked = (e: any) => {
    e.stopPropagation();
    //setPivotControls(!pivotControlsEnabled);
    const clickedMesh = e.object;
    console.log("Clicked mesh:", clickedMesh);
    console.log("Clicked mesh:", clickedMesh.name);
    const point = e.point.clone();
    setModalData({
      position: point,
      name: clickedMesh.name,
      uuid: clickedMesh.uuid
    });
    setModalOpen(true);
    console.log("Clicked point:", point);    
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
      <group
        onPointerMissed={() => { // click off
          setModalOpen(false);
          setModalData(null);
        }}
      >
        <PivotControls enabled={pivotControlsEnabled} onDragStart={pivotDragStart} onDragEnd={pivotDragEnd}>
            <Gltf
              ref={gltfRef}
              castShadow
              position={[0, -0.5, 0]} 
              src={props.model}
              onClick={modelClicked}
            />
            {modalOpen && modalData ? 
              <HTMLModal
                gltfRef={gltfRef}
                position={modalData.position}
                name={modalData.name}
                uuid={modalData.uuid} />
              : null}
        </PivotControls>
      </group>
    </>
  )
}

export function ModelBrowser(){
    const [selectedModel, setSelectedModel] = useState<ModelEntry>();

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
                <Canvas 
                  shadows 
                  gl={{ preserveDrawingBuffer: true }} 
                  camera={{ position: [0, 0, 5], fov: 90 }} 
                  frameloop="demand">
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

function userRef<T>() {
  throw new Error('Function not implemented.')
}
