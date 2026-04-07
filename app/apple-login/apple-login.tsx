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
                    top: 0,
                    left: 0,
                    zIndex: 999999,
                    background: "red",
                    cursor: "pointer",
                }}
                onClick={() => clicked()}
                >
                TEST
            </button>
            {flag ? <p>test</p> : null }
        </>
    )
}