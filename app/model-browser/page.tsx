"use client"
import { ModelBrowser } from "./model-browser-component";
import { checkUser } from "../db/general/get-user";
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from "react";

export default function ModelBrowserPage(){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            
            if (user) { setUser(user); }
            setLoading(false);
        };
        init();
    }, []);

     if (loading) return <p className="p-4">Checking session...</p>;
    if (!user) return <p>Not logged in</p>;

    return (
        <>
            <div className="header">Model Browser </div>
            <ModelBrowser />       
        </> 
    )
}