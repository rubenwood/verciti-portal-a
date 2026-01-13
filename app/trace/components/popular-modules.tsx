"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PopularModulesCard(props: any){
    if(props.data == null ) { return null; }
    
    const [mostPlayedModule, setMostPlayedModule] = useState<string>("");
    const [mostPlayedCount, setMostPlayedCount] = useState<number>(0);
    const [mostUsersModule, setMostUsersModule] = useState<string>("");
    const [mostPlayTime, setMostPlayTimeModule] = useState<string>("");    


    function allMostFrequent(arr: any[]): any[] {
        const count = new Map();
        let maxFreq = 0;

        for (let val of arr) {
            const freq = (count.get(val) || 0) + 1;
            count.set(val, freq);
            if (freq > maxFreq) maxFreq = freq;
        }
        return [...count.entries()]
            .filter(([key, freq]) => freq === maxFreq)
            .map(([key]) => key);
    }

    const findMostPopularByUserCount = () => {
        const activities: any[] = [];
        const activityIds: string[] = [];
        for (const user of props.data) {
            for(const activity of user.generic_activity_progress){
                console.log("Activity:", activity.activity_id);
                if(!activities.includes(activity)) { activities.push(activity); }
                activityIds.push(activity.activity_id);
            }
        }
        const mostFrequent = allMostFrequent(activityIds);
        console.log("Most Frequent Activities by Users IDs:", mostFrequent);
        console.log("Activities List:", activities);
        console.log(activities[0].activity_id == mostFrequent[0]); 
        const mostPlayedByUserCount = activities.find((activity) => activity.activity_id == mostFrequent[0] );
        console.log("Most Frequent Activities by Users:", mostPlayedByUserCount);
        setMostUsersModule(mostPlayedByUserCount.external_title);
    }

    const findMostPlayed = () => {
        const playCounts: {[key: string]: number} = {};
        for (const user of props.data) {
            for(const activity of user.generic_activity_progress){
                if(!(activity.activity_id in playCounts)){
                    playCounts[activity.activity_id] = 0;
                }
                playCounts[activity.activity_id] += activity.attempts.length;
            }
        }
        const mostPlayedActivityId = Object.keys(playCounts).reduce((a, b) => playCounts[a] > playCounts[b] ? a : b);
        const mostPlayedActivity = props.data[0].generic_activity_progress.find((activity: any) => activity.activity_id === mostPlayedActivityId);
        setMostPlayedModule(mostPlayedActivity.external_title);
        setMostPlayedCount(playCounts[mostPlayedActivityId]);
    }


    const findMostPlayedTime = () => {
        // need to get attempt duration from generic_activity_attempts
    }

    useEffect(() => {
        findMostPopularByUserCount();
        findMostPlayed();
    }, [props.data]);    

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Popular Modules
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                Most Played Module (Num plays):<br/>{mostPlayedModule} - {mostPlayedCount}<br/><br/>
                Most Played Module (Num users):<br/>{mostUsersModule}<br/><br/>
                Most Played Module (Play time):<br/>{mostPlayTime}<br/><br/>
            </CardContent>
        </Card>
    )
}