"use client"
import { useEffect, useRef } from "react";

export default function AppleLogin(props: any){
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/FBAN|FBAV|Instagram/.test(ua)) {
            alert("You are inside an in-app browser — buttons may not work. Please open in Safari.");
        } else {
            alert("You are in Safari / normal browser — buttons should work.");
        }
    }, []);

    const handleClick = () => {
        if (buttonRef.current) {
            // Change color when clicked
            buttonRef.current.style.backgroundColor = "#00FF00"; // green
        }
        alert("WORKS");
    };

    return (
        <>
            <button
                ref={buttonRef}
                style={{
                    position: "fixed",
                    top: 20,
                    left: 20,
                    zIndex: 999999,
                    background: "red",
                    cursor: "pointer",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                    fontWeight: "bold",
                }}
                onClick={handleClick}
            >
                TEST
            </button>
        </>
    )
}