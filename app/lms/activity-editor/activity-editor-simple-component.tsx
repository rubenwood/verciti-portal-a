"use client"
import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Edit,
} from "lucide-react"

import { showConfetti,
    fetchActivities,
    insertActivity,
    updateActivity,
    fetchStagesByIds,
    updateStage,
    fetchInfoTextById,
    updateInfoTextFull } from "../../db/general/utils"
import { PostgrestError } from "@supabase/supabase-js"
import { supabaseTest } from "@/lib/supabase";

import { ActivityBrowser } from "./activity-browser"
import { ActivityDetailsEditor } from "./activity-details-editor"
import { ActivityStagesEditor } from "./activity-stages-editor"

// CONTEXT
export const EditingActivityContext = createContext<{ editingActivity: Activity | null; setEditingActivity: (a: Activity | null) => void;} | null>(null);

// STAGE EDITOR COMPONENTS
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


// INFO TEXT EDITOR COMPONENTS
export function InfoTextEditor({ infoTextId }: {infoTextId: string}){
    const [infoText, setInfoText] = useState<InfoText | PostgrestError>();
    const [infoTextValue, setInfoTextValue] = useState("");

    const saveBtnRef = useRef<HTMLButtonElement>(null);
    const saveChanges = async () => {
        const updatedInfoText: InfoText = JSON.parse(infoTextValue);
        setInfoText(updatedInfoText);
        await updateInfoTextFull(supabaseTest, updatedInfoText);
        showConfetti(saveBtnRef);
    }

    useEffect(() => {
        // load info text by id
        const loadInfoText = async () => {
            if (infoTextId) {
                const fetchedInfoText = await fetchInfoTextById(supabaseTest, infoTextId);
                if(!fetchedInfoText || 'message' in fetchedInfoText){
                    console.error("Error fetching info text:", fetchedInfoText);
                    return;
                }
                setInfoText(fetchedInfoText);
                setInfoTextValue(JSON.stringify(fetchedInfoText, null, 2));
            }
        }
        loadInfoText();
    }, [infoTextId]);

    if (!infoText || "message" in infoText) return <p>Loading...</p>;

    return(
        <div>
            <b>Info Text Editor</b>
            <Textarea 
                className="editable-textarea" 
                rows={20}
                value={infoTextValue}
                onChange={(e) => setInfoTextValue(e.target.value)}
            />
            <br />
            <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Info Text Changes</Button>
        </div>
    )
}

// MAIN COMPONENT
export default function ActivityEditorSimple() {
    const [activities, setActivities] = useState<PostgrestError | Activity[]>();
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const getActivities = async () => {
        let temp = await fetchActivities(supabaseTest);
        setActivities(temp);
    };

    const showActivityCreator = async () => {
        const newAct: Activity = {
            external_title: "New Activity",
            internal_title: "New Activity Internal",
            time_est: "10 mins~",
            time_est_num: "600",
            about_text: "This is a new activity.",
            learning_objectives: "Learn about something new.",
            params: { assets: [], stage_ids: [] },
            type: "lesson",
            qr_url: "",
            icon_url: "",
            title_asset_url: "",
            dir_name: "Dev"
        };
        const tmp = await insertActivity(supabaseTest, newAct);
        console.log("Inserted activity:", tmp);
        await getActivities();
    }

    return (
    <div className="space-y-6">
        <div className="space-x-4">
            <Button className="green-shadcn-button" onClick={getActivities}><Edit />Edit Existing</Button>
            <Button className="green-shadcn-button" onClick={showActivityCreator}><Plus />Create New</Button>
        </div>

        <EditingActivityContext.Provider value={{ editingActivity, setEditingActivity }}>
        {/* Activity browser */
            Array.isArray(activities) ? (
                <ActivityBrowser activities={activities} />
            ) : activities ? (
                <div className="text-red-500">Error: {activities.message}</div>
            ) : null
        }
        { /* Activity editor, metadata and stages */
            editingActivity ?
                <>
                    <ActivityDetailsEditor />
                    <ActivityStagesEditor />
                </> : null
        }
        </EditingActivityContext.Provider>
    </div>
    );
}