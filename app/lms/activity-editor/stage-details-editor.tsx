"use client"
import { useEffect, useRef, useState } from "react";
import { showConfetti, updateStage } from "@/app/db/general/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { InfoTextEditor } from "./activity-editor-simple-component";
import { supabaseTest } from "@/lib/supabase";

export function StageDetailsEditor({ stage, index }: {stage: Stage, index: number}){
    const [inStage, setStage] = useState<Stage>(stage);
    const [stageValue, setStageValue] = useState("");

    const [editingContent, setEditingContent] = useState(false);

    const saveBtnRef = useRef<HTMLButtonElement>(null);
    const saveChanges = async () => {
        const updatedStage: Stage = JSON.parse(stageValue);
        setStage(updatedStage);
        await updateStage(supabaseTest, updatedStage);
        showConfetti(saveBtnRef);
    }

    useEffect(() => {
        setStage(stage);
        setStageValue(JSON.stringify(stage, null, 2));
    }, [stage]);

    if (!inStage) return <p>Loading...</p>;

    return(
        <Card key={stage.id} className="mb-4">
            <CardHeader>
                <CardTitle className="text-md">
                    Stage #: {index + 1}<br/>
                    Stage ID: {stage.id}<br/>
                    Type: {stage.type}
                </CardTitle>
            </CardHeader>            
            <CardContent>
                <Button onClick={() => { setEditingContent(!editingContent); }} className="mb-4">
                    {editingContent ? "Hide Stage Editor" : "Edit Stage"}
                </Button>
                {editingContent ? (
                <div className="space-y-2">
                    <div>
                        <Label>Stage Data:</Label>
                        <Textarea 
                        className="editable-textarea" 
                        rows={10}
                        value={stageValue}
                        onChange={(e) => setStageValue(e.target.value)} />
                    </div>
                    <br/>
                    <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Stage Changes</Button>
                    <br />
                    {stage.type === 'info' ? 
                        <InfoTextEditor infoTextId={stage.params.infoTextId} />
                    : null
                    }
                </div>
                ) : null}                   
            </CardContent>
            
        </Card>
    )
}
