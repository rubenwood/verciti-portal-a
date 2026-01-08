"use client"
import Image from "next/image";
import { UserProgress } from "./components/user-prog";
export default function TraceLandingPage(){
    return (
        <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
            <Image
                className="dark:invert"
                src="https://cdn.prod.website-files.com/66fc1efd047a029224c72fb0/66fc28b252d9d3641f6b168b_Verciti_Logo_Dark_Background.svg"
                alt="Verciti lxogo"
                width={180}
                height={38}
                priority
            />
            <h1 className="text-2xl">Verciti Trace</h1>
            <br/>
            <UserProgress />
        </div>       
    )
}