"use client"
import { ModelBrowser } from "./model-browser-component";
import { checkUser } from "../db/general/get-user";
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from "react";

export default function ModelBrowserPage(){
    const [user, setUser] = useState<User | null>();
    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { setUser(user); }
        };
        init();
    });
    
    return (
        <>
        <div className="header">
            Model Browser
        </div>
        {user ? <ModelBrowser /> : <p>Not logged in</p>}        
        </> 
    )
}