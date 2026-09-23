"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

import { showConfetti } from "@/app/db/general/utils";

export default function S3Invalidator(props: any) {
    const [folder, setFolder] = useState("");
    const [status, setStatus] = useState("");
    const btnRef = useRef<HTMLButtonElement>(null);

    async function handleInvalidate() {
        if (!folder) {
            setStatus("Please enter a folder path.");
            return;
        }

        setStatus("Invalidating...");

        const res = await fetch("/api/aws/invalidate", {
            method: "POST",
            body: JSON.stringify({ user:props.user, folder }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.success) {
            showConfetti(btnRef);
            setStatus(`Invalidation created for: ${folder}`);
        } else {
            setStatus("Failed: " + data.error);
        }
    }

    return (
        <div>
            <h2 className="subheader">S3 File Invalidator</h2>
            <p>Enter a path to a folder you wish to invalidate.</p>
            <p>Path must begin with "/", for example; /dev/public, will invalidate (refresh) all files in that folder.</p>
            <br/>
            <Input
                type="text"
                placeholder="/path/to/folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
            />

            <br />

            <Button ref={btnRef} className="green-shadcn-button" onClick={handleInvalidate}>
                Invalidate CloudFront Folder
            </Button>

            <p>{status}</p>
        </div>
    );
}
