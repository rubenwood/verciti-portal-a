"use client"
export const dynamic = "force-dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkUser } from "../general/get-user";
import { CopyTablesTool } from "./copy-tables/copy-tables";
import { getUserProfile } from "../general/utils";
import { supabaseTest } from "@/lib/supabase";

export default function ToolsPage(){
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            console.log("Checked user in tools page:", users);
            if (users && users.testUser) { 
                const profile = await getUserProfile(supabaseTest, users.testUser);
                console.log("User profile in tools page:", profile);
                setRole(profile?.data?.role || null);
            }
        };
        init();
    }, []);

    if(role !== "admin"){ return <p>Not logged in {role}</p> }
        
    return (
        <>
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

            <br/>
            {/* <DataCopyTool /> */}
            <br/>
            <CopyTablesTool />
        </div>
        </>
    )
}