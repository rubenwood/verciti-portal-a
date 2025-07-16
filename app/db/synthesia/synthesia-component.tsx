// Create synthesia videos from a specific template using the infot text as the scriptText

import { Button } from "@/components/ui/button";
import { Background } from "@xyflow/react";
import { useRef, useState } from "react";

import { getInfoTextsByBatchId, showConfetti } from "../../db/general/utils";


export async function createSynthesiaVideoFromTemplate(infoText: InfoText,videoTitle: string) {
    console.log(infoText.text_en_uk.body);

    const response = await fetch('https://api.synthesia.io/v2/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '3cd3c875d802fe559c24bd50f0170327'
        },
        body: JSON.stringify({
            test: false,
            title: videoTitle,
            visibility: 'private',
            aspectRatio: '16:9',
            input: [
            {
                scriptText: infoText.text_en_uk.body,
                avatar: 'de94052e-fdd0-4a27-8d6d-5e1dab38f2fe',
                avatarSettings: {scale: 0.75, style: 'circular', backgroundColor: '#f6f2f2'},
                background: 'workspace-media.eefd0e26-7cc4-4825-8963-114363cc0dbe',
                backgroundSettings: {
                    videoSettings: {
                        shortBackgroundContentMatchMode: 'freeze',
                        longBackgroundContentMatchMode: 'trim'
                    }
                }
            }
            ]
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create Synthesia video\n${await response.text()}`);
    }

    return await response.json();
}

export default function BatchSynthesia() {
    const [batchId, setBatchId] = useState<string>("");
    const [videoTitlePrefix, setVideoTitlePrefix] = useState<string>("");
    const submitBtnRef = useRef<HTMLButtonElement | null>(null);

    const createSynthesia = async () => {
        const infoTexts = await getInfoTextsByBatchId(batchId);
        if (!infoTexts || infoTexts.length === 0) {
            console.error("No info texts found for the given batch ID.");
            return;
        }
        
        let i = 1;
        for (const infoText of infoTexts) {
            const videoTitle = `${videoTitlePrefix}-${i}`;
            try {
                const videoResponse = await createSynthesiaVideoFromTemplate(infoText, videoTitle);
                console.log(`Video created successfully: ${videoResponse.id}`);
            } catch (error) {
                console.error(`Error creating video for info text ID ${infoText.id}:`, error);
            }
            i++;

            if( i > 10) {
                console.warn("Stopping after 10 videos to avoid rate limits.");
                break;
            }
        }

        showConfetti(submitBtnRef);
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
            <Button ref={submitBtnRef} className="green-shadcn-button" onClick={createSynthesia}>Create Synthesia For batch</Button>
        </div>
        </>
    )
}