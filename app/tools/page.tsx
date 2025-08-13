'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

import { User } from '@supabase/supabase-js'
import { checkUser } from "../db/general/get-user";
import Login from '../login/login-component'

export default function ToolsDashboard(){
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { setUser(user); }
        };
        init();
    })

    if(!user){ return <Login setUserFunc={setUser} user={user} /> }

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