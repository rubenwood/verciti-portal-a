"use client"
import { useEffect, useState } from "react";
import { supabaseMain } from '@/lib/supabase'
import { Button } from "@/components/ui/button";

export default function GoogleLogin(){
    const [deeplink, setDeeplink] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [ready, setReady] = useState(false); // hydration flag

    useEffect(() => {
        setReady(true);
        if (typeof window === "undefined") return;

        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.replace("#", ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("token_type");

        if (accessToken) {
            const atStr = `&at=${encodeURIComponent(accessToken)}`;
            const rtStr = refreshToken ? `&rt=${encodeURIComponent(refreshToken)}` : "";
            const ttStr = tokenType ? `&tt=${encodeURIComponent(tokenType)}` : "";

            const newDeeplink = `verciti://app?glogin${atStr}${rtStr}${ttStr}`;

            localStorage.setItem("verciti_deeplink", newDeeplink);
            setDeeplink(newDeeplink);

            window.location.href = newDeeplink;
            return;
        }

        const stored = localStorage.getItem("verciti_deeplink");
        if (stored) {
            setDeeplink(stored);
        }
    }, []);

    const openApp = () =>{
        if(deeplink == null) return;
        window.location.href = deeplink;
    }
    const openApp2 = () =>{
        window.location.href = 'verciti://app';
    }

    const handleLoginWithGoogle = async () => {
        const { data, error } = await supabaseMain.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://vertciti-portal.vercel.app/google-login/'
            }
        });
        if(error){
            setError(error.message);
            console.error('Google Login error:', error.message);
        } else {
            console.log('Google Login initiated:', data);
        }
    }

    if(!ready){ return null; }

    return(
        <div className="grid items-center justify-items-center min-h-screen">
            {deeplink == null ?
                <>
                    <p className="text-center">Logging in with Google...</p>
                    <Button className="green-shadcn-button" onClick={handleLoginWithGoogle}>
                        Login with Google
                    </Button>
                </>
            :
                <>
                    <p className="text-center">If you are not redirected automatically, please click the button below to return to the Verciti App.</p>
                    <Button className="green-shadcn-button" onClick={openApp}>
                        Return to Verciti App
                    </Button>
                </>
            }
            <Button className="green-shadcn-button" onClick={openApp2}>
                Test
            </Button>
            <br/>
            <a href="verciti://app">test 2</a>
        </div>
    );
}