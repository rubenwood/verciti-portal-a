"use client"
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";


export function AssetEditor({ assets }: {assets: object}){

    if(!assets){ return null; }
    return (
        <>
            <Label>Asset:</Label>
            {Object.values(assets).map((a, i) => (
                <div key={i}>
                    <p>{a.path}</p>
                </div>
            ))}
        </>
    )
}