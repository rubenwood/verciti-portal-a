"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "../../db/general/utils";

export function UsageTimeCard(props: any){
    if(props.data == null ) { return null; }
    
    const [totalUsageTime, setTotalUsageTime] = useState<number>(0);

    useEffect(() => {
        let totalUsageTime = 0;
        for(let user of props.data) {
            totalUsageTime += user.total_usage_time;
        }
        setTotalUsageTime(totalUsageTime);
    }, [props.data]);    

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader className="text-lg font-semibold">
                <CardTitle className="text-lg font-semibold text-center">Total Usage Time</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                <p className="text-4xl">{formatDuration(totalUsageTime)}</p>
            </CardContent>
        </Card>
    )
}