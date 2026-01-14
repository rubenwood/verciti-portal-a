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
            <CardContent className="flex flex-1 items-center justify-center">
                Most Played Module (# plays):<br/>{props.mostPlayed?.moduleTitle} - {props.mostPlayed?.playCount}<br/><br/>
                Most Played Module (# users):<br/>{props.mostPlayedByUserCount.moduleTitles.join(", ")} - {props.mostPlayedByUserCount.userCount}<br/><br/>
                Most Played Module (time):<br/>{props.mostPlayedTime?.moduleTitle} - {formatDuration(props.mostPlayedTime?.playTime)}<br/><br/>
            </CardContent>
        </Card>
    )
}