"use client"
import { useEffect, useState } from "react";

export default function GoogleLogin(){
    //const [accessToken, setAccessToken] = useState<string | null>(null);
    //const [refreshToken, setRefreshToken] = useState<string | null>(null);
    //const [tokenType, setTokenType] = useState<string | null>(null);
    const [deeplink, setDeeplink] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("token_type");
        
        if (accessToken) {
            //setAccessToken(accessToken);
            //setRefreshToken(refreshToken);
            //setTokenType(tokenType);
            const deeplink = `verciti://edtechapp?at=${encodeURIComponent(accessToken)}
            ${refreshToken != null ? `&rt=${encodeURIComponent(refreshToken)}` : ''}
            ${tokenType != null ? `&tt=${encodeURIComponent(tokenType)}` : ''}`;
            setDeeplink(deeplink);
            //window.location.href = deeplink;
        }
    }, []);

    const openApp = () =>{
        if(deeplink == null) return;
        alert(deeplink);
        window.open(deeplink);
    }

    return(
        <div>
            <button className="button mt-2" onClick={openApp}>
                Return to Verciti App
            </button>
        </div>
    );
}