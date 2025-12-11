"use client"
import { useContext, useEffect, useRef, useState } from "react";

import { EditingActivityContext } from "./activity-editor-simple-component"
import { fetchStagesByIds } from "@/app/db/general/utils";
import { supabaseTest } from "@/lib/supabase";
import { StageDetailsEditor } from "./stage-details-editor";

export function StageList(){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context || !context.editingActivity) { return null; }
    const { editingActivity, setEditingActivity } = context;
    // other state vars
    const [stages, setStages] = useState<Stage[]>([]);

    useEffect(() => {
        console.log("Editing activity changed, load stages...");
        const loadStages = async () => {
            if (editingActivity && editingActivity.params.stage_ids) {
                const tmpStages = await fetchStagesByIds(supabaseTest, editingActivity.params.stage_ids);

                if(!Array.isArray(tmpStages)){
                    console.error("Error fetching stages:", tmpStages);
                    return;
                }

                setStages(tmpStages);
            }
        };
        loadStages();
    }, [editingActivity]);

    return(
        <div>
            {/* display a list of stage here, each should have an edit button*/}
            {stages.length === 0 ? (
                <div>No stages found for this activity.</div>
            ) : (stages.map((s: Stage, index: number) => (
                <StageDetailsEditor stage={s} index={index} key={s.id} />
            )))}
        </div>
    )
}