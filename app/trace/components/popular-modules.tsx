"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";

export function PopularModulesCard(props: any){
    useEffect(() => {

    }, [props.mostPlayedByUserCount, props.mostPlayed, props.mostPlayedTime]);    

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Popular Modules
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                Most Played Module (Num plays):<br/>{props.mostPlayed?.moduleTitle} - {props.mostPlayed?.playCount}<br/><br/>
                Most Played Module (Num users):<br/>{props.mostPlayedByUserCount.moduleTitle} - {props.mostPlayedByUserCount.playCount}<br/><br/>
                Most Played Module (Play time):<br/>{props.mostPlayedTime?.moduleTitle} - {formatDuration(props.mostPlayedTime?.playTime)}<br/><br/>
            </CardContent>
        </Card>
    )
}