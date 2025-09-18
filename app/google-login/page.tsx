"use client"
import { useEffect, useState } from "react";

export default function GoogleLogin(){
    const [deeplink, setDeeplink] = useState<string | null>(null);

    useEffect(() => {
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

    return(
        <div>
            <button className="button mt-2" onClick={openApp}>
                Return to Verciti App
            </button>
        </div>
    );
}