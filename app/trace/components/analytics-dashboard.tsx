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
    calcMostPlayedTime } from "@/app/db/user/user-prog-analytics";

import {
    getUsersCreatedInTimePeriod,
    getUsersLoggedInTimePeriod
} from "@/app/db/user/user-gen-analytics";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserProgress } from "./user-prog-table";
import { TotalUsersCard } from "./total-users-card";
import { UserLoginsCard } from "./user-logins-card";
import { ModulesCard } from "./total-modules-card"
import { UsageTimeCard } from "./usage-time";
import { NewRetUsersCard } from "./new-ret-users-card";
import { PopularModulesCard } from "./popular-modules";
import { QuizCard } from "./quiz-card";
import { MonthlyTable, MonthlyTotalUserTable } from "./tables/monthly-table";
import { calcAverageQuizScore, calcCompletedQuizzes, calcTotalQuizDuration, calcTotalQuizStages, getUsersQuizAttempts } from "@/app/db/user/user-quiz-analytics";

export function AnalyticsDashboard() {
    const [cohortName, setCohortName] = useState<string>("Verciti");

    const [userProgressData, setUserProgressData] = useState<any[]>();
    const [userAttemptsData, setUserAttemptsData] = useState<any[]>();
    const [userQuizData, setUserQuizData] = useState<any[]>();

    const getAllData = async () => {
        if(!cohortName || cohortName.trim() === "") {
            alert("Please enter a cohort name.");
            return;
        }

        const data = await getUsersProgressByVisibility(supabaseTest, cohortName);
        setUserProgressData(data);
        //console.log("User Progress Data:", data);

        const attempts = await getUserAttempts(supabaseTest, data.map((user) => user.id), 0, 1000);
        for(let i = 0; i < attempts.pageCount-1; i++){
            const moreAttempts = await getUserAttempts(supabaseTest, data.map((user) => user.id), i+1, 1000);
            attempts.data = attempts.data.concat(moreAttempts.data);
        }
        setUserAttemptsData(attempts.data);
        //console.log("User Attempts Data:", attempts);

        const quizData = await getUsersQuizAttempts(supabaseTest, data.map((user) => user.id));
        setUserQuizData(quizData);
        console.log("User Quiz Data:", quizData);
    }

    const begin = async () => {
        await getAllData();
    }

    useEffect(() => {
        
    }, [userProgressData, userAttemptsData, userQuizData]);

    if(!userProgressData || !userAttemptsData || !userQuizData){
        return (
            <>
                <input type="text" placeholder="cohort name" onChange={(e) => setCohortName(e.target.value)} />
                <Button onClick={begin}>Begin</Button>
                <br/>
            </>
        )
    }

    return (
        <>
            <input type="text" placeholder="cohort name" onChange={(e) => setCohortName(e.target.value)} />
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
                <UserLoginsCard 
                    loginsToday={getUsersLoggedInTimePeriod(userProgressData, new Date(Date.now() - 24*60*60*1000), new Date())}
                    logins7Days={getUsersLoggedInTimePeriod(userProgressData, new Date(Date.now() - 7*24*60*60*1000), new Date())}
                    logins30Days={getUsersLoggedInTimePeriod(userProgressData, new Date(Date.now() - 30*24*60*60*1000), new Date())}
                />
                <NewRetUsersCard data={userProgressData} />
                <PopularModulesCard 
                    mostPlayed={calcMostPlayed(userProgressData)}
                    mostPlayedByUserCount={calcMostPopularByUserCount(userProgressData)}
                    mostPlayedTime={calcMostPlayedTime(userAttemptsData)}
                />
                <QuizCard 
                    totalQuizzes={calcTotalQuizStages(userQuizData)}
                    totalQuizAttempts={userQuizData?.length || 0} 
                    completedQuizzes={calcCompletedQuizzes(userQuizData)}
                    totalQuizDuration={calcTotalQuizDuration(userQuizData)} 
                    averageQuizScore={calcAverageQuizScore(userQuizData)} 
                />
            </div>
            <br />
            <div className="grid grid-cols-2 gap-4">
                <MonthlyTotalUserTable 
                    year={2025} 
                    metricName="# Users"
                    data={(getUsersCreatedInTimePeriod(userProgressData, new Date("2025-01-01"), new Date("2025-12-31")))}
                />
                <MonthlyTotalUserTable 
                    year={2026} 
                    metricName="# Users"
                    data={(getUsersCreatedInTimePeriod(userProgressData, new Date("2026-01-01"), new Date("2026-12-31")))}
                />
            </div>
            <br />
            <UserProgress data={userProgressData} />
        </>
    )
}