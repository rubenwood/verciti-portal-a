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
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Total Modules Completed
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                <p className="text-4xl">{modulesCompleted}</p>
            </CardContent>
        </Card>
    )
}