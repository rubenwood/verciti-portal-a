"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabaseTest } from '@/lib/supabase'


export default function AppleLogin(props: any){
    const [error, setError] = useState('');

    useEffect(() => {
        const hash = window.location.hash;

        if (!hash) return;

        const params = new URLSearchParams(hash.replace("#", ""));

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        console.log('Apple Login tokens from URL:', { accessToken, refreshToken });
        if(accessToken == null) return;

        const atStr = `&at=${encodeURIComponent(accessToken)}`;
        const rtStr = refreshToken ? `&rt=${encodeURIComponent(refreshToken)}` : "";

        if (accessToken) {
            const deeplink = `verciti://app?alogin${atStr}${rtStr}`;
            window.location.href = deeplink;
        }
  }, []);

    const login = async () => {
        console.log('Initiating Apple Login for client:', props.client);
        //const client = props.client === "live" ? supabaseMain : supabaseTest;
        const { data, error } = await supabaseTest.auth.signInWithOAuth({
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