"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganisationDetails } from "./forms/org-details";
import { PlatformAccessTable } from "./tables/platform-acc-table";
import { TrainingProviderTable } from "./tables/training-prov-table";

export default function SubscribeLandingPage(){
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
            <div>
                <h1 className="text-2xl">Subscribe</h1>
            </div>
            <OrganisationDetails />
            <br/>
            <PlatformAccessTable />
            <br />
            <TrainingProviderTable />
        </div>
    )
}