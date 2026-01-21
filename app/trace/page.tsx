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

    if(!user){ return(<p>Not logged in</p>) }

    return (
        <div className="dark bg-background text-foreground">
            <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
                <h1 className="text-2xl">Verciti Analytics</h1>
                <br/>
                <AnalyticsDashboard />
            </div>
        </div>
    )
}