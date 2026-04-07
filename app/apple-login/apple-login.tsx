"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabaseMainApple, supabaseTestApple } from '@/lib/supabase'


export default function AppleLogin(props: any){
    const [error, setError] = useState('');
    const [deeplink, setDeeplink] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("sb-live");
            localStorage.removeItem("sb-test");
        }

        document.cookie.split(';').forEach((c) => {
            if(c.includes('sb-live') || c.includes('sb-test')) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            }
        });

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
            const newDeeplink = `verciti://app?alogin${atStr}${rtStr}`;
            localStorage.setItem("verciti_deeplink", newDeeplink);
            setDeeplink(newDeeplink);
            window.location.href = newDeeplink;
        }
    }, []);

    const login = async () => {
        console.log('Initiating Apple Login for client:', props.client);
        const client = props.client === "live" ? supabaseMainApple : supabaseTestApple;
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

    const openApp = () =>{
        if(deeplink == null) return;
        window.location.href = deeplink;
    }

    return(
        <div className="grid grid-cols-1 gap-20 mt-20 p-5 items-center justify-items-center">
            {deeplink == null ? (
                <>
                    <p>If you are not automatically logged in please click the button below.</p>
                    <Button onClick={login}>
                        Sign in with Apple
                    </Button>            
                </>                
            ) : (
                <>
                    <p className="text-center">If you are not redirected automatically, please click the button below to return to the Verciti App.</p>
                    <Button onClick={openApp}>
                        Open App
                    </Button>
                </>
            )}
        </div>
    )
}