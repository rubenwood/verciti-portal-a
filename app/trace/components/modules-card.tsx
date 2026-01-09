"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModulesCard(props: any){
    if(props.data == null ) { return null; }
    
    const [modulesCompleted, setModulesCompleted] = useState<number>(0);

    useEffect(() => {
        let totalModulesCompleted = 0;
        for(let user of props.data) {
            for(let activity of user.generic_activity_progress) {
                if(activity.completion >= 1){
                    totalModulesCompleted += 1;
                }
            }
        }
        setModulesCompleted(totalModulesCompleted);
    }, [props.data]);    

    return (
        <Card className="mb-4 p-4">
            <CardHeader className="text-lg font-semibold">
                <CardTitle>Total Modules Completed</CardTitle>
            </CardHeader>
            <CardContent>
                {modulesCompleted}
            </CardContent>
        </Card>
    )
}