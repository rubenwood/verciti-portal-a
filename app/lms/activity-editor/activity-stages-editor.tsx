"use client"
import { useContext, useState } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StageList } from "./activity-editor-simple-component";

import { EditingActivityContext } from "./activity-editor-simple-component";

export function ActivityStagesEditor(){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context || !context.editingActivity) { return null; }
    const { editingActivity, setEditingActivity } = context;

    // other state vars
    const [stageDetailsMinimized, setStageDetailsMinimized] = useState(true);

    return (
        <Card className="border-gray-400">
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStageDetailsMinimized(!stageDetailsMinimized)}
                    className="gap-2 p-2"
                >
                    {stageDetailsMinimized ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronUp className="h-4 w-4" />
                    )}
                </Button>
                <div>
                    <CardTitle className="text-lg">Stage Details</CardTitle>
                    <CardDescription>
                    {stageDetailsMinimized
                        ? "Click to expand stage editor"
                        : "Update the stages for this activity"}
                    </CardDescription>
                </div>
                </div>
            </div>
            </CardHeader>
            {!stageDetailsMinimized && (
                <CardContent className="pt-0 space-y-4">
                    <StageList />
                </CardContent>
            )}
        </Card>
    )
}