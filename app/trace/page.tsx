"use client"
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { checkUser } from "../db/general/get-user";

import Image from "next/image";

import { AnalyticsDashboard } from "./components/analytics-dashboard"


export default function TraceLandingPage(){
    const [user, setUser] = useState<User | null>(null);

    
    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            if (users) { setUser(users.testUser); }
        };
        init();
    }, []);

    if(!user){ return <p>Not logged in</p> }

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
            <AnalyticsDashboard />
        </div>       
    )
}