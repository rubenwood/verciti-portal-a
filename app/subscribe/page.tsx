"use client"
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <div className="mt-8 w-full max-w-6xl">
                <h1 className="text-3xl font-semibold text-center mb-6">
                    Choose Your Subscription
                </h1>

                <Tabs defaultValue="employers" className="w-full">

                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="providers">
                        Colleges & Training Providers
                    </TabsTrigger>
                    <TabsTrigger value="employers">
                        Employers & Industry
                    </TabsTrigger>

                    
                </TabsList>

                <TabsContent value="employers">
                    <PlatformAccessTable />
                </TabsContent>

                <TabsContent value="providers">
                    <TrainingProviderTable />
                </TabsContent>

                </Tabs>
            </div>
        </div>
    )
}