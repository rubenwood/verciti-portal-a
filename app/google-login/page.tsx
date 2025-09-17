"use client"
import { useEffect, useState } from "react";

export default function GoogleLogin(props: any){



    return(
        <div>
            <button className="button mt-2">
                Return to Verciti App
            </button>
            {props.error && <p className="text-red-500 mt-2">{props.error}</p>}
        </div>
    );
}