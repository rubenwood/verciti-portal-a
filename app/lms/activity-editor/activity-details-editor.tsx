"use client"
import { showConfetti, updateActivity } from "@/app/db/general/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react"
import { ActivityDetailElement } from "./activity-details";
import { supabaseTest } from "@/lib/supabase";

import { EditingActivityContext } from "./activity-editor-simple-component";
import { Badge } from "@/components/ui/badge";

export function ActivityDetailsEditor(){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context || !context.editingActivity) { return null; }
    const { editingActivity, setEditingActivity } = context;

    // other state vars
    const [activityDetailsMinimized, setActivityDetailsMinimized] = useState(true);

    const saveBtnRef = useRef<HTMLButtonElement>(null);
    
    const handleActivityUpdate = (colName: string, value: any) => {
        setEditingActivity({
            ...editingActivity,
            [colName]: value,
        });
    }

    const saveChanges = async () => {
        await updateActivity(supabaseTest, editingActivity);
        showConfetti(saveBtnRef);
    }

    useEffect(() => {}, [editingActivity]);
    
    return (
        <Card className="border-gray-400">
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActivityDetailsMinimized(!activityDetailsMinimized)}
                        className="gap-2 p-2"
                    >
                        {activityDetailsMinimized ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronUp className="h-4 w-4" />
                        )}
                    </Button>
                    <div>
                        <CardTitle className="text-lg">Activity Details - {editingActivity.external_title}</CardTitle>
                        <div className="flex gap-1 mb-1">
                            <Badge className="text-xs bg-blue-500">{editingActivity.id}</Badge>
                            <Badge className="text-xs bg-blue-500">{editingActivity.type}</Badge>
                        </div>                    
                        <CardDescription>
                        {activityDetailsMinimized
                            ? "Click to expand activity editor"
                            : "Update the basic information for this activity"}
                        </CardDescription>
                    </div>
                </div>
            </div>
            </CardHeader>
            {!activityDetailsMinimized && (
            <CardContent className="pt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">                
                <ActivityDetailElement 
                detailName="title"
                colName="external_title"
                value={editingActivity.external_title}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="estimatedTime"
                colName="time_est"
                value={editingActivity.time_est}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="estimatedTimeNum"
                colName="time_est_num"
                value={editingActivity.time_est_num}
                onChange={handleActivityUpdate} />
                
                <ActivityDetailElement 
                detailName="about"
                colName="about_text"
                value={editingActivity.about_text}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="learningObjectives"
                colName="learning_objectives"
                value={editingActivity.learning_objectives}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="status"
                colName="status"
                value={editingActivity.status}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="dirName"
                colName="dir_name"
                value={editingActivity.dir_name}
                onChange={handleActivityUpdate} />
                </div>
                
                <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Activity Changes</Button>
            </CardContent>
            )}
        </Card>
    )
}