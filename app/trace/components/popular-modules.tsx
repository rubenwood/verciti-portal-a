"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PopularModulesCard(props: any){
    if(props.data == null ) { return null; }
    
    const [mostPlayedModule, setMostPlayedModule] = useState<string>("");
    const [mostUsersModule, setMostUsersModule] = useState<string>("");
    const [mostPlayTime, setMostPlayTimeModule] = useState<string>("");    

    useEffect(() => {

    }, [props.data]);    

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Popular Modules
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                <p>Most Played Module (Num plays): {mostPlayedModule}</p><br/>
                <p>Most Played Module (Num users): {mostUsersModule}</p><br/>
                <p>Most Played Module (Play time): {mostPlayTime}</p><br/>
            </CardContent>
        </Card>
    )
}