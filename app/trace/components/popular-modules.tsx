"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";

export function PopularModulesCard(props: any){
    useEffect(() => {

    }, [props.mostPlayed, props.mostPlayedByUserCount, props.mostPlayedTime]);

    const formatModuleTitles = (titles: string[]) => {
        return titles.map(title => <><p key={title}>{title}</p><br/></>)
    }

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Most Popular Modules
                </CardTitle>
            </CardHeader>
            <CardContent className="gridflex flex-1 items-center justify-center">                
                <span className="grid grid-cols-3 border-b-2 border-t-2 w-full">
                    <p className="border-1 p-1">Most Played Module (# plays):</p>
                    <p className="border-1 p-1">{props.mostPlayed?.moduleTitle}</p>
                    <p className="border-1 p-1">{props.mostPlayed?.playCount}</p>
                </span>
                <br/>
                <span className="grid grid-cols-3 border-b-2 border-t-2 w-full">
                    <p className="border-1 p-1">Most Played Module (# users):</p>
                    <p className="border-1 p-1">{props.mostPlayedByUserCount.moduleTitles.join(", ")}</p>
                    <p className="border-1 p-1">{props.mostPlayedByUserCount.userCount}</p>
                </span>
                <br/>
                <span className="grid grid-cols-3 border-b-2 border-t-2 w-full">
                    <p className="border-1 p-1">Most Played Module (time):</p>
                    <p className="border-1 p-1">{props.mostPlayedTime?.moduleTitle}</p>
                    <p className="border-1 p-1">{formatDuration(props.mostPlayedTime?.playTime)}</p>
                </span>
                <br/><br/>
            </CardContent>
        </Card>
    )
}