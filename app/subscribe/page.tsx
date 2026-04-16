"use client"
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PlatformAccessTable } from "./tables/platform-acc-table";
import { TrainingProviderTable } from "./tables/training-prov-table";
import { Separator } from "@/components/ui/separator";

//https://youtu.be/OnktX6QjsOc

export default function SubscribeLandingPage(){
    return (
        <div className="dark grid items-center justify-items-center min-h-screen p-8 pb-20">
            <Image
                src="https://cdn.prod.website-files.com/66fc1efd047a029224c72fb0/66fc28b252d9d3641f6b168b_Verciti_Logo_Dark_Background.svg"
                alt="Verciti logo"
                width={180*1.2}
                height={38*1.2}
                priority
            />
            <br/>
            <br/>
            <p>Try the Verciti app now</p><br/>
            <div className="flex flex-row space-x-4">
                <Image 
                    src="/google/GetItOnGooglePlay_Badge_Web_color_English.svg" 
                    alt="get it on google play"
                    width={478/2}
                    height={142/2}
                    className="cursor-pointer"
                    onClick={()=> window.open("https://play.google.com/store/apps/details?id=com.verciti.edtechapp")}
                />
                <Image 
                    src="/apple/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" 
                    alt="get it on apple"
                    width={478/2.23}
                    height={142/2.23}
                    className="cursor-pointer"
                    onClick={()=> window.open("https://apps.apple.com/us/app/verciti-skills-training/id6753941306")}
                />
            </div>
            <br/>
            <Separator className="w-full max-w-6xl my-8" />
            <iframe 
                width={1905/2}
                height={822/2}
                src="https://www.youtube.com/embed/OnktX6QjsOc"
                title="Verciti AI | The Platform Powering the Net Zero Workforce"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="rounded-lg shadow-lg"
                >
            </iframe>
            <br/>
            <Separator className="w-full max-w-6xl" />
            <div className="mt-8 w-full max-w-6xl">
                <Tabs defaultValue="providers" className="w-full">

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