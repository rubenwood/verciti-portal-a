"use client"
import { useEffect, useState } from 'react';

export default function AppleLogin(props: any){
    const [flag, setFlag] = useState(false);


    const clicked = () => {
        setFlag(true);
        alert("Clicked");
    }

    return(
        <>
            <button
                style={{
                    position: "fixed",
                    top: 40, // avoid safe area
                    left: 20,
                    zIndex: 1000,
                    background: "red",
                    cursor: "pointer",
                    padding: "10px 20px",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                }}
                onClick={clicked}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    clicked();
                }}
            >
            TEST
            </button>
            {flag ? <p>test</p> : null }
        </>
    )
}