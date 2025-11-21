"use client"
import { useEffect, useState } from "react";
import { supabasePublicMain } from '@/lib/supabase'

export default function GoogleLogin(){
    const [deeplink, setDeeplink] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if(deeplink == null){ handleLoginWithGoogle(); }
        if (typeof window === "undefined") return;

        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("token_type");
        
        if (accessToken) {
            let atStr = accessToken != null ? `&at=${encodeURIComponent(accessToken)}` : '';
            let rtStr = refreshToken != null ? `&rt=${encodeURIComponent(refreshToken)}` : '';
            let ttStr = tokenType != null ? `&tt=${encodeURIComponent(tokenType)}` : '';
            
            const deeplink = `verciti://app?glogin${atStr}${rtStr}${ttStr}`;
            setDeeplink(deeplink);
            window.location.href = deeplink;            
        }
    }, []);

    const openApp = () =>{
        if(deeplink == null) return;
        console.log(deeplink);
        window.location.href = deeplink;
    }

    const handleLoginWithGoogle = async () => {
            const { data, error } = await supabasePublicMain.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://vertciti-portal.vercel.app/google-login'
                }
            });
            if(error){
                setError(error.message);
                console.error('Google Login error:', error.message);
            } else {
                console.log('Google Login initiated:', data);
            }
        }

    return(
        <div className="grid items-center justify-items-center min-h-screen">
            {deeplink == null ?
                <>
                    <p className="text-center">Logging in with Google...</p>
                    <button className="button mt-2" onClick={handleLoginWithGoogle}>
                        Login with Google
                    </button>
                </>
            :
                <>
                    <p className="text-center">If you are not redirected automatically, please click the button below to return to the Verciti App.</p>
                    <button className="button mt-2" onClick={openApp}>
                        Return to Verciti App
                    </button>
                </>
            }            
        </div>
    );
}