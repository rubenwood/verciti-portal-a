import { Html } from '@react-three/drei'
import { LoaderCircle } from 'lucide-react';

export function ModelLoading(){
    return(
        <>
            <Html center className="text-gray-500">
                <LoaderCircle className="spin" size={24} />
            </Html>
        </>
    )
}
