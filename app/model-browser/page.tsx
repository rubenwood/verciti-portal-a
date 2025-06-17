"use client"
import Image from "next/image";
import { ModelBrowser } from "./model-browser-component";

export default function ModelBrowserPage(){
    return (
        <>
        <div className="header">
            Model Browser
        </div>
        <ModelBrowser />
        </> 
    )
}