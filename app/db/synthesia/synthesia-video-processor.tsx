import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

import { showConfetti } from "../general/utils";

type VideoStatus = "pending" | "converting" | "done" | "error";

interface VideoItem {
    key: string;
    size: number;
    status: VideoStatus;
    error?: string;
}

export default function SynthesiaVideoProcessor() {
    const [folderPath, setFolderPath] = useState("");
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [listing, setListing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const processBtnRef = useRef<HTMLButtonElement>(null);

    const listFolder = async () => {
        if (!folderPath.trim()) return;
        setListing(true);
        setVideos([]);

        try {
            const res = await fetch(
                `/api/aws/list-folder?prefix=${encodeURIComponent(folderPath)}`
            );
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setVideos(
                data.videos.map((v: { key: string; size: number }) => ({
                    ...v,
                    status: "pending" as VideoStatus,
                }))
            );
        } catch (err) {
            console.error("Failed to list folder", err);
        } finally {
            setListing(false);
        }
    };

    const processAll = async () => {
        setProcessing(true);

        for (let i = 0; i < videos.length; i++) {
            setVideos((prev) =>
                prev.map((v, idx) => (idx === i ? { ...v, status: "converting" } : v))
            );

            try {
                const res = await fetch("/api/synthesia/convert-video", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: videos[i].key }),
                });

                if (!res.ok) throw new Error(await res.text());

                setVideos((prev) =>
                    prev.map((v, idx) => (idx === i ? { ...v, status: "done" } : v))
                );
            } catch (err) {
                setVideos((prev) =>
                    prev.map((v, idx) =>
                        idx === i
                            ? { ...v, status: "error", error: String(err) }
                            : v
                    )
                );
            }
        }

        setProcessing(false);
        showConfetti(processBtnRef);
    };

    const doneCount = videos.filter((v) => v.status === "done").length;

    return (
        <div className="grey-border p-4 rounded-md">
            <b>Process Synthesia Videos</b>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
                Scales videos in an S3 folder to 1920x1080 at 1500k bitrate, overwriting
                the originals.
            </p>

            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    placeholder="/dev/public/videos/lesson1/"
                    className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <Button onClick={listFolder} disabled={listing || processing}>
                    {listing ? "Listing..." : "List Videos"}
                </Button>
            </div>

            {videos.length > 0 && (
                <div className="flex flex-col gap-1 mb-3 max-h-64 overflow-y-auto">
                    {videos.map((v) => (
                        <div
                            key={v.key}
                            className="flex items-center justify-between border rounded px-3 py-1.5 text-sm"
                        >
                            <span className="truncate mr-2">{v.key}</span>
                            <span
                                className={
                                    v.status === "error"
                                        ? "text-red-500 text-xs"
                                        : "text-xs text-muted-foreground capitalize"
                                }
                            >
                                {v.status === "error" ? v.error ?? "Error" : v.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {videos.length > 0 && (
                <Button
                    ref={processBtnRef}
                    onClick={processAll}
                    disabled={processing || listing}
                >
                    {processing
                        ? `Converting (${doneCount}/${videos.length})...`
                        : "Convert & Overwrite All"}
                </Button>
            )}
        </div>
    );
}