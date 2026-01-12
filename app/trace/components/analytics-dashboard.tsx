"use client"
import { useEffect, useState } from "react";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProgress, getUsersProgressByVisibility } from "@/app/db/user/user-prog";

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

    const begin = async () => {
        const data = await getUsersProgressByVisibility(supabaseTest, "Verciti");
        setUserProgressData(data);
        console.log("User Progress Data:", data);
    }

    useEffect(() => {
        
    }, [userProgressData]);

    if(!userProgressData){
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
                <TotalUsersCard data={userProgressData} />
                <ModulesCard data={userProgressData} />
                <UsageTimeCard data={userProgressData} />
                <UserLoginsCard data={userProgressData} />
                <NewRetUsersCard data={userProgressData} />
                <PopularModulesCard data={userProgressData} />
            </div>
            <br />
            <UserProgress data={userProgressData} />
        </>
    )
}