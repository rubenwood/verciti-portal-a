// this will list the models from the S3 bucket
// clicking one will display it in a 3D scene
import { createContext, Suspense, useState, useEffect } from 'react'
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
            src={props.model}
            onClick={modelClicked}
            /> 
        </PivotControls>
    </>
  )
}

export function ModelBrowser(){
    const [selectedModel, setSelectedModel] = useState<string>();

    useEffect(() => {      
      const modelUrl =
      'https://s3.eu-west-1.amazonaws.com/com.verciti.app1/models/Testing/TestingCube.glb?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAAaCWV1LXdlc3QtMSJHMEUCIQDA0dNjFSuhMky67t3fAKCV9oiBIMmxf2oNZSizbotnJQIgUvbsWtuyWRxO5Fv%2BpbiaL3CKJVEr60EQAl%2BBvKNcSoQqwgMI2f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxMDMyNTk2OTI5MTAiDKTDJLoD9qV%2FJkJgoSqWAxqYnAfP%2FIWaE71zwJVOIKCJIOjP%2BfL08AM7EISjAGE7%2F5NSvCa8o%2FNLXrnhC0XweSk2srmXwdic6oB9P3j2UpdEKLo3%2BZU1YQOphc9hBK10%2F%2Bzl2R8k%2Fo1W9zFdPAyjurxtXghBNy7BS7Z75dT7Mp4EYbYgchpIcsKFJqsC4Y0AUwTJbMXOswtnsfZsbf%2BX7ByEkr21QqyVUcBo2hgrM2Tiumz5w8j9LtM9C10KYC28SqOiTk1Egh34TQzN6XtUCsv4n6woD7pEK1370RLRgkSnclbuNN%2BzW9MttoMyOzLWVAnfgtgyVPXDKD7DR7clhwdtOyGX%2FWC8vjxsonwCrQKcaCrxyx5jvWErisCjO6dlae0e8jbLllhl%2BwC%2FnpGaV09GXo%2F5xrlYTF1Zn%2Fw1qX6ZNtPrNc%2FxLhrnRxw7Fok0dBj9JuR2LsO1MXDk0QE3nxVK6nhms5PP81SFszLRtMUB4n3weKCfq9e3HBr%2F7DR1KVJpW8fxgh402teJSu5wKE0GGyMEyC9o89vOU63llHz300r4APwwnKilwgY63gK4LO63ICy4vFBwsUdvD1%2B%2FZnBVDulbNaECAo9Zy%2FGZAJjS5gjs3zLOZj8uEw2BJCY%2B4%2FshrVGAIol3je9ypeTh%2Bt3N4GJuXVphQeDni7Q504lMKGFPle9f4QbwpLnbgwh40WEOjKybq2s0hU51MXhb7JF6wHwch%2FCE0nBrfG%2F942Ox0b8djZNnOV5J9B7ktR4fT0C9IPK7Fn87Ji8mLajiVSyAnpodhyvr1vJzDjmJ%2FeWZN5m4kOG3S5kPsJYc0xFYYHQ8t8Cs%2FuDiktghgc4je6pTaihzk2bWQb6T5qebnLFI0nO26nkrsif8jyV65jbzHmJo60PVffWktDmlPPBbCnfRdnLjTt8HnSMbd9pq9aHsbGacW49Gg%2BeTWkER3DcZ3mbXjvVJdLkO3DJPw5uDA327kf2NBEgEWCOE63dsAS1AiL2O97uGdaO5TXOHg8mSMV4PYCi3sOgP%2F3LIxQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIARQCWB35XFQWYQPUA%2F20250611%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20250611T155111Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=a421d715fe9083fbe3cee82f5d1e36d06827350073706422ee638721b5e107e3';
      setSelectedModel(modelUrl);
    }, []);

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