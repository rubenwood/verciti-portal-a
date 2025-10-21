"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkUser } from "../general/get-user";
import { User } from "@supabase/supabase-js";
import { DataCopyTool } from "./data-copy/data-copy";

export default function ToolsPage(){
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { setUser(user); }
        };
        init();
    }, []);

    if(!user){ return <p>Not logged in</p> }
        
    return (
        <div className="grid items-center justify-items-center">
            <Image
                className="dark:invert"
                src="https://cdn.prod.website-files.com/66fc1efd047a029224c72fb0/66fc28b252d9d3641f6b168b_Verciti_Logo_Dark_Background.svg"
                alt="Verciti lxogo"
                width={180}
                height={38}
                priority
            />
            <h1 className="mt-10 text-2xl font-bold">Tools</h1>
            <DataCopyTool />
        </div>       
    )
}