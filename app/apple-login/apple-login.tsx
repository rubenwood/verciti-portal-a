"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabaseMain, supabaseTest } from '@/lib/supabase'


export default function AppleLogin(props: any){
    const [error, setError] = useState('');
    const [deeplink, setDeeplink] = useState<string | null>(null);

    useEffect(() => {
        const hash = window.location.hash;

        if (!hash) return;

        const params = new URLSearchParams(hash.replace("#", ""));

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const tokenType = params.get("token_type");
        if(accessToken == null) return;

        const atStr = `&at=${encodeURIComponent(accessToken)}`;
        const rtStr = refreshToken ? `&rt=${encodeURIComponent(refreshToken)}` : "";
        const ttStr = tokenType ? `&tt=${encodeURIComponent(tokenType)}` : "";

        if (accessToken) {
            // Detect iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            const scheme = isIOS ? "unitydl://" : "verciti://"; // TODO: iOS uses unitydl for now, may change in future
            const newDeeplink = `${scheme}app?alogin${atStr}${rtStr}${ttStr}`;
            localStorage.setItem("verciti_deeplink", newDeeplink);
            setDeeplink(newDeeplink);
        }
    }, []);

    const login = async () => {
        //console.log('Initiating Apple Login for client:', props.client);
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

    const openApp = () =>{
        if(deeplink == null) { 
            //alert("no dl");
            return; 
        }
        //alert(deeplink);
        window.location.href = deeplink;
    }

    const openAppFallback = () => {
        window.location.href = "unitydl://app";
    }

    return(
        <>
            <div className="grid grid-cols-1 gap-20 mt-20 p-5 items-center justify-items-center">
                {deeplink == null ? (
                    <>
                        <Image src="/Bright_Green_No_Tagline_1024x224.png" alt="Verciti Logo" width={512} height={112}/>
                        <p>Login to the Verciti App</p>
                        <p>If you are not automatically logged in please click the button below.</p>
                        <Button onClick={login} className="z-50 relative">
                            Sign in with Apple
                        </Button>
                    </>                
                ) : (
                    <>  
                        <Image src="/Bright_Green_No_Tagline_1024x224.png" alt="Verciti Logo" width={512} height={112}/>
                        <p>Login to the Verciti App</p>
                        <p className="text-center">If you are not redirected automatically, please click the button below to return to the Verciti App.</p>
                        <Button onClick={openApp} className="z-50 relative">
                            Open App
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}