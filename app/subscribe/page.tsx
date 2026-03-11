"use client"
import Image from "next/image";
import { PlatformAccessTable } from "./tables/platform-acc-table";
import { TrainingProviderTable } from "./tables/training-prov-table";

export default function SubscribeLandingPage(){
    return (
        <div className="dark grid items-center justify-items-center min-h-screen p-8 pb-20">
            <Image
                src="https://cdn.prod.website-files.com/66fc1efd047a029224c72fb0/66fc28b252d9d3641f6b168b_Verciti_Logo_Dark_Background.svg"
                alt="Verciti logo"
                width={180}
                height={38}
                priority
            />
            <br/ >
            <br/ >
            <div>
                <h1 className="text-2xl">Subscribe</h1>
            </div>
            <br/>
            <PlatformAccessTable />
            <br />
            <TrainingProviderTable />
        </div>
    )
}