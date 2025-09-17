"use client"
import { useEffect, useState } from "react";

export default function GoogleLogin(props: any){

    useEffect(() => {
        //const hash = window.location.hash.slice(1); // remove #
        //const hashParams = new URLSearchParams(hash);
//
        //const at = hashParams.get("access_token");
        //const rt = hashParams.get("refresh_token");
    });

    const openApp = () =>{
        window.open('verciti://edtechapp');
    }

    return(
        <div>
            <button className="button mt-2" onClick={openApp}>
                Return to Verciti App
            </button>
            {props.error && <p className="text-red-500 mt-2">{props.error}</p>}
        </div>
    );
}