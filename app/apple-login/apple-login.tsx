"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabaseMain, supabaseTest } from '@/lib/supabase'


export default function AppleLogin(props: any){
    const [error, setError] = useState('');

    const login = async () => {
        const client = props.client === "live" ? supabaseMain : supabaseTest;
        const { data, error } = await client.auth.signInWithOAuth({
            provider: "apple",
            options: {
                redirectTo: `https://vertciti-portal.vercel.app/apple-login/${props.client}`
            }
        });

        if(error){
            setError(error.message);
            console.error('Apple Login error:', error.message);
        } else {
            console.log('Apple Login initiated:', data);
        }
    };

    return(
        <div className="grid grid-cols-1 gap-20 mt-20 p-5 items-center justify-items-center">
            <Button onClick={login}>
                Sign in with Apple
            </Button>
        </div>
    )
}