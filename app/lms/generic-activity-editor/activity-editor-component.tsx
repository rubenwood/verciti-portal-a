"use client"
import { createContext, Suspense, useState } from 'react'
import { Canvas } from "@react-three/fiber"
import { GizmoHelper, GizmoViewport, Gltf, OrbitControls, PivotControls, Stage } from '@react-three/drei'
import { DefaultStage, InteractiveScene, ModelBrowser } from '../../model-browser/model-browser-component'

import { supabasePublicMain } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export const SelectedModelContext = createContext<any>(null) 

export default function GenericActivityEditor(){
    const [selectedModel, setSelectedModel] = useState();

    return (  
        <>
            {/* TOP LEFT ITEMS */} 
            
            {/*
            <div className='top-left-div'>
                <SelectedModelContext.Provider value={{selectedModel, setSelectedModel}}>
                <ModelBrowser />
                </SelectedModelContext.Provider>
                <br/>    
                <ModelUploader />
                <br/>
            </div>
            <TrackPanelMain />
            */}

            {/* MAIN (3D) SCENE} */}
            <ModelBrowser />
            
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