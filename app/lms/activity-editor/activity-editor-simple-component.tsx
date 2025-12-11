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