"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PopularModulesCard(props: any){
    if(props.data == null ) { return null; }
    
    const [mostPlayedModule, setMostPlayedModule] = useState<string>("");
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

    const findMostPopularByUsers = () => {
        const activities: string[] = [];
        for (const user of props.data) {
            for(const activity of user.generic_activity_progress){
                console.log("Activity:", activity.activity_id);
                activities.push(activity.activity_id);
            }
        }
        const mostFrequent = allMostFrequent(activities);
        console.log("Most Frequent Activities by Users:", mostFrequent);
    }

    useEffect(() => {
        findMostPopularByUsers();
    }, [props.data]);    

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Popular Modules
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                Most Played Module (Num plays): {mostPlayedModule}<br/>
                Most Played Module (Num users): {mostUsersModule}<br/>
                Most Played Module (Play time): {mostPlayTime}<br/>
            </CardContent>
        </Card>
    )
}