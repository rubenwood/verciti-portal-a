"use client"
import { useEffect, useState } from "react";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProgress,
    getUsersProgressByVisibility,
    getUserAttempts,
    calcTotalUniqueModulesCompleted,
    calcTotalModulesCompleted,
    calcTotalUsageTime,
    calcMostPopularByUserCount,
    calcMostPlayed,
    calcMostPlayedTime } from "@/app/db/user/user-prog";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserProgress } from "../components/user-prog";
import { TotalUsersCard } from "./total-users-card";
import { UserLoginsCard } from "./user-logins-card";
import { ModulesCard } from "./total-modules-card"
import { UsageTimeCard } from "./usage-time";
import { NewRetUsersCard } from "./new-ret-users-card";
import { PopularModulesCard } from "./popular-modules";

export function AnalyticsDashboard() {
    const [userProgressData, setUserProgressData] = useState<any[]>();
    const [userAttemptsData, setUserAttemptsData] = useState<any[]>();

    const getAllData = async () => {
        const data = await getUsersProgressByVisibility(supabaseTest, "Verciti");
        setUserProgressData(data);

        const attempts = await getUserAttempts(supabaseTest, data.map((user) => user.id), 0, 1000);
        for(let i = 0; i < attempts.pageCount-1; i++){
            const moreAttempts = await getUserAttempts(supabaseTest, data.map((user) => user.id), i+1, 1000);
            attempts.data = attempts.data.concat(moreAttempts.data);
        }
        setUserAttemptsData(attempts.data);
        console.log("User Progress Data:", data);
        console.log("User Attempts Data:", attempts);
    }

    const begin = async () => {
        await getAllData();
    }

    useEffect(() => {
        
    }, [userProgressData, userAttemptsData]);

    if(!userProgressData || !userAttemptsData){
        return (
            <>
                <Button onClick={begin}>Begin</Button>
                <br/>
            </>
        )
    }

    return (
        <>
            <Button onClick={begin}>Begin</Button>
            <br/>
            Timefame
            <br/>
            start:
            <input type="date" />
            end:
            <input type="date" />
            <br/>
            <div className="grid grid-cols-3 gap-4">
                <TotalUsersCard totalUsers={userProgressData.length} />
                <ModulesCard 
                    totalModulesCompleted={calcTotalModulesCompleted(userProgressData)}
                    uniqueModulesCompleted={calcTotalUniqueModulesCompleted(userProgressData)}
                />
                <UsageTimeCard totalUsageTime={calcTotalUsageTime(userProgressData)} />
                <UserLoginsCard data={userProgressData} />
                <NewRetUsersCard data={userProgressData} />
                <PopularModulesCard 
                    mostPlayed={calcMostPlayed(userProgressData)}
                    mostPlayedByUserCount={calcMostPopularByUserCount(userProgressData)}
                    mostPlayedTime={calcMostPlayedTime(userAttemptsData)}
                />
            </div>
            <br />
            <UserProgress data={userProgressData} />
        </>
    )
}