"use client"
import { useEffect, useState } from "react";

export default function GoogleLogin(){
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [tokenType, setTokenType] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("token_type");
        alert('AT: '+accessToken);
        alert('RT: '+refreshToken);
        alert('TT: '+tokenType);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            const deeplink = `verciti://edtechapp?access_token=${encodeURIComponent(
                accessToken
            )}${refreshToken ? `&refresh_token=${encodeURIComponent(refreshToken)}` : ""}`;

            //window.location.href = deeplink;
        }
    }, []);

    const openApp = () =>{
        let dl = 'verciti://edtechapp?at='+accessToken+'&rt='+refreshToken;
        alert(dl);
        window.open(dl, '_self');
    }

    return(
        <div>
            <button className="button mt-2" onClick={openApp}>
                Return to Verciti App
            </button>
        </div>
    );
}