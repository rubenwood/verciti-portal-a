"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";
import { Clock, Play, User } from "lucide-react";

export function PopularModulesCard(props: any){
    useEffect(() => {

    }, [props.mostPlayed, props.mostPlayedByUserCount, props.mostPlayedTime]);

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Most Popular Modules
                </CardTitle>
            </CardHeader>
            <CardContent className="gridflex flex-1 items-center justify-center">                
                <span className="grid grid-cols-3 border-b-2 border-t-2 w-full">
                    <p className="border-1 p-2">Most Played Module <Play className="size-4"/></p>
                    <p className="border-1 p-2">{props.mostPlayed?.moduleTitle}</p>
                    <p className="border-1 p-2">{props.mostPlayed?.playCount}</p>
                    <p className="border-1 p-2">Most Played Module <User className="size-4"/></p>
                    <p className="border-1 p-2">{props.mostPlayedByUserCount.moduleTitles.join(", ")}</p>
                    <p className="border-1 p-2">{props.mostPlayedByUserCount.userCount}</p>
                    <p className="border-1 p-2">Most Played Module <Clock className="size-4"/></p>
                    <p className="border-1 p-2">{props.mostPlayedTime?.moduleTitle}</p>
                    <p className="border-1 p-2">{formatDuration(props.mostPlayedTime?.playTime)}</p>
                </span>
            </CardContent>
        </Card>
    )
}