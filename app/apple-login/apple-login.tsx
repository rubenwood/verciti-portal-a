"use client"
import { useEffect } from "react";

export default function AppleLogin(props: any){
    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/FBAN|FBAV|Instagram/.test(ua)) {
            alert("You are inside an in-app browser — buttons may not work. Please open in Safari.");
        } else {
            alert("You are in Safari / normal browser — buttons should work.");
        }
    }, []);

    return(
        <>
            <button
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 999999,
                    background: "red",
                }}
                onClick={() => alert("WORKS")}
                >
                TEST
            </button>
        </>
    )
}