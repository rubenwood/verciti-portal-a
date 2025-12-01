'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

import { User } from '@supabase/supabase-js'
import { checkUser } from "../db/general/get-user";
import Login from '../login/login-component'
import { getUserProfile } from "../db/general/utils";    
import { supabaseTest } from "@/lib/supabase";
        

export default function ToolsDashboard(){
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { 
                setUser(user);
                const profile = await getUserProfile(supabaseTest, user);
                setRole(profile?.data?.role || null);
            }
        };
        init();
    })

    if(!user){ return <Login setUserFunc={setUser} user={user} /> }
    if(role !== "admin"){ return <p>Not logged in</p> }

    return(
        <>
            <h1 className="header">Here you will find various tools</h1>
            <div>
                <ul>
                    <li>
                        <Link href="/tools/printable-applicant-form">Printable Applicant Form</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}