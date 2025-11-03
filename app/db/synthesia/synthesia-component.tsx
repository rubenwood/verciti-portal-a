// Create synthesia videos from a specific template using the infot text as the scriptText

import { Button } from "@/components/ui/button";
import { Background } from "@xyflow/react";
import { useRef, useState } from "react";

import { getInfoTextsByBatchId, updateMediaPaths, showConfetti } from "../../db/general/utils";


async function createSynthesiaVideo(infoText: InfoText,videoTitle: string, testMode: boolean = false) {
    console.log(infoText.text_en_uk.body);

    const response = await fetch('/api/synthesia/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            test: testMode,
            title: videoTitle,
            visibility: 'private',
            aspectRatio: '16:9',
            input: [
                {
                    scriptText: infoText.text_en_uk.body,
                    avatar: 'de94052e-fdd0-4a27-8d6d-5e1dab38f2fe',
                    avatarSettings: {
                        scale: 0.75,
                        style: 'circular',
                        backgroundColor: '#121212', // #121212
                    },
                    background: 'workspace-media.8676edcf-664a-4f7b-b250-e706340e0a5e',
                    backgroundSettings: {
                        videoSettings: {
                            shortBackgroundContentMatchMode: 'freeze',
                            longBackgroundContentMatchMode: 'trim',
                        },
                    },
                },
            ],
        }),
    })

    if (!response.ok) {
        throw new Error(`Failed to create Synthesia video\n${await response.text()}`);
    }

    return await response.json();
}
// TODO: currently lists 0 - 100 videos, should be paginated
async function listAllVideos() {
        const response = await fetch('/api/synthesia/list', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.error(`Failed to list videos`, await response.json());
            return null;
        }
        const data = await response.json();
        console.log(data);
        return data;
}

export default function BatchSynthesia() {
    const [batchId, setBatchId] = useState<string>("");
    const [videoTitlePrefix, setVideoTitlePrefix] = useState<string>("");
    const [videoTitleBatchId, setVideoTitleBatchId] = useState<string>("");
    const [s3Folder, setS3Folder] = useState<string>("");
    const submitBtnRef = useRef<HTMLButtonElement | null>(null);
    const copyVideosBtnRef = useRef<HTMLButtonElement | null>(null);

    const createSynthesia = async () => {
        const infoTexts = await getInfoTextsByBatchId(batchId);
        if (!infoTexts || infoTexts.length === 0) {
            console.error("No info texts found for the given batch ID.");
            return;
        }
        
        let videoIds = [];
        let i = 1;
        for (const infoText of infoTexts) {
            const videoTitle = `${infoText.batch_id}_${infoText.sheet_id}_info_${infoText.id}_`;
            try {
                const videoResponse = await createSynthesiaVideo(infoText, videoTitle, false);
                console.log(`Video created successfully: ${videoResponse.id}`)
                videoIds.push(videoResponse.id);
            } catch (error) {
                console.error(`Error creating video for info text ID ${infoText.id}:`, error);
            }
            i++;

            if(i > 100) {
                console.warn("Stopping after 100 videos to avoid rate limits.");
                break;
            }
        }
        showConfetti(submitBtnRef);
    }

    async function copyVideosToS3(s3Folder: string, videoTitleBatchId: string){
        console.log("Copying videos to S3...");
        const synthesiaPayload: SynthesiaPayload = await listAllVideos();
        const videosInBatch: SynthesiaVideo[] = [];

        for(const vid of synthesiaPayload.videos) {
            if(vid.title.startsWith(videoTitleBatchId)) {
                videosInBatch.push(vid);
            }
        }

        const response = await fetch('/api/aws/upload-synthesia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videos: videosInBatch,
                filepath: s3Folder
            }),
        });

        if (!response.ok) {
            console.error(`Failed to copy videos to S3`, await response.text());
            return null;
        }

        const data = await response.json();
        console.log("Videos copied to S3:", data);
        // update info text to have the S3 URL
        updateMediaPaths(data.uploaded);
        console.log("Media paths updated in the database.");
        showConfetti(copyVideosBtnRef);
    }


    return (
        <>
        <div className="grey-border">
            <b>Batch Synthesia</b><br/>
            <i>
                Create Synthesia videos for a batch of info texts.<br/>
                Enter the Batch ID and a prefix for the video titles.<br/>
                The script text will be taken from the info text body.
            </i>
            <input
                type='text'
                placeholder='Batch ID' 
                className='input input-bordered w-full max-w-xs border rounded px-2 py-1'
                onChange={(e) => setBatchId(e.target.value)} />
            <br/>
            <input 
                type='text'
                placeholder='Video Title Prefix'
                className='input input-bordered w-full max-w-xs border rounded px-2 py-1'
                onChange={(e) => setVideoTitlePrefix(e.target.value)} />
            <br/>
            <Button ref={submitBtnRef} className="green-shadcn-button" onClick={createSynthesia}>Create Synthesia For batch</Button><br />
            <Button className="green-shadcn-button" onClick={listAllVideos}>List all videos</Button>
            <br/>
            <br/>
            <i>
            Once Synthesias are created use this to copy them from synthesia to S3<br/>
            Enter the S3 folder path (not trailing / at beginning nor end).<br/>
            You must specify the path including "dev/"
            </i>
            <br />
            <input 
                type='text' 
                placeholder='S3 Folder' 
                className='input input-bordered w-full max-w-xs border rounded px-2 py-1'
                onChange={(e) => setS3Folder(e.target.value)}
            />
            <input 
                type='text' 
                placeholder='video title batch id' 
                className='input input-bordered w-full max-w-xs border rounded px-2 py-1'
                onChange={(e) => setVideoTitleBatchId(e.target.value)}
            />
            <br/>
            <Button ref={copyVideosBtnRef} className="green-shadcn-button" onClick={() => copyVideosToS3(s3Folder, videoTitleBatchId)}>Copy videos to S3</Button><br />
        </div>
        </>
    )
}