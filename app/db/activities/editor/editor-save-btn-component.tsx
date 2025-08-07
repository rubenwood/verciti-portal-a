"use client"
import { useRef } from "react";
import { updateActivity, showConfetti } from "../../general/utils";
import { Button } from "@/components/ui/button";

export default function EditorSaveButton(props: any){
    const saveButtonRef = useRef<any>(null);
    
    const saveChanges = async (selectedActivity: any) => {
        if(selectedActivity == undefined){ return; }
        // save the modified params back to supabase
        const result = await updateActivity(selectedActivity);
        if(result.error){
            console.log(result.error);
        } else {
            showConfetti(saveButtonRef);
        }
    }

    return(
        <div className="p-5">
            <Button ref={saveButtonRef} 
                    className="green-shadcn-button" 
                    onClick={() => saveChanges(props.selectedActivity)}
            >
                Save
            </Button>
        </div>
    );
}