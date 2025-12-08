'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

import { User } from '@supabase/supabase-js'
import { checkUser } from "../db/general/get-user";
import Login from '../login/login-component'
import { getUserProfile } from "../db/general/utils";    
import { supabaseTest } from "@/lib/supabase";
import S3Invalidator from "./s3invalidator/s3invalidator";
        

export default function ToolsDashboard(){
    const [testUser, setTestUser] = useState<User | null>(null);
    const [liveUser, setLiveUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            if (users && users.testUser) { 
                setTestUser(users.testUser);
                setLiveUser(users.liveUser);
                const profile = await getUserProfile(supabaseTest, users.testUser);
                setRole(profile?.data?.role || null);
            }
        };
        init();
    })

    if(!testUser){ return <Login setUserFunc={setTestUser} user={testUser} /> }
    if(role !== "admin"){ return <p>Not logged in</p> }

    return(
        <>
            <h1 className="header">Here you will find various tools</h1>
            <br/>
            <div className="center-col">
            <S3Invalidator user={testUser} />
                <div>
                    <ul>
                        <li>
                            <Link href="/tools/printable-applicant-form">Printable Applicant Form</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}