"use client"
import { useEffect, useRef } from "react";

export default function AppleLogin(props: any){
    const buttonRef = useRef<HTMLButtonElement | null>(null);

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
                <span>TEST</span>
            </button>
        </>
    )
}