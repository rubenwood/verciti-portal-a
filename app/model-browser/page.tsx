"use client"
import Image from "next/image";
import { ModelBrowser } from "./model-browser-component";

export default function ModelBrowserPage(){
    return (
        <>
        <div className="grid items-center justify-items-center">
            Model Browser
        </div>
        <ModelBrowser />
        </> 
    )
}