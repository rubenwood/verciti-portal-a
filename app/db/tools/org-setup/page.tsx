"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkUser } from "../../general/get-user";
import { getUserProfile } from "../../general/utils";
import { supabaseTest } from "@/lib/supabase";
import { OrgSetupTool } from "./org-setup";

export default function OrgSetupPage(){
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
        <div className="dark bg-background text-foreground">
            <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
                <h1 className="mt-10 text-2xl font-bold">Org Setup</h1>
                <OrgSetupTool />
            </div>
        </div>
        </>
    )
}