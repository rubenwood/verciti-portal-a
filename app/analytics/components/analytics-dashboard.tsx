"use client"
import { useEffect, useMemo, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
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

import { Button } from "@/components/ui/button";
import { UserProgressTable } from "./user-prog-table";

import { StatCard } from "./general/stat-card";
import { PopularModulesCard } from "./popular-modules";
import { QuizCard } from "./quiz-card";
import { MonthlyTable, MonthlyTotalUserTable } from "./tables/monthly-table";
import { 
    calcAverageQuizScore, 
    calcCompletedQuizzes,
    calcTotalQuizDuration, 
    calcTotalQuizStages,
    getUsersQuizAttempts
} from "@/app/db/user/user-quiz-analytics";
import { BookIcon, BrainIcon, ClockIcon, TrendingUp, TrophyIcon, UsersIcon } from "lucide-react";
import { formatDuration } from "@/app/db/general/utils";


export function AnalyticsDashboard(props: any) {
    const [userQuizData, setUserQuizData] = useState<any[]>();

    // Stats
    const stats = useMemo(() => {
        if (!props.userProgressData || !props.userAttemptsData || !props.userQuizData) return null;

        return {
            totalUsers: {
                label: "Total Users",
                value: props.userProgressData.length,
                change: "",
                icon: UsersIcon,
            },
            usageTime: {
                label: "Usage Time",
                value: formatDuration(calcTotalUsageTime(props.userProgressData)),
                change: "",
                icon: ClockIcon,
            },
            modules: {
                label: "Modules Completed",
                value: calcTotalModulesCompleted(props.userProgressData),
                change: "",
                icon: BookIcon,
            },
            quizzes: {
                label: "Quiz Attempts",
                value: props.userQuizData.length,
                change: "",
                icon: TrophyIcon,
            },
            averageQuizScore:{
                label: "Average Score",
                value: `${(calcAverageQuizScore(props.userQuizData)*100).toFixed(2)}%`,
                change: "",
                icon: TrendingUp
            }
        };
    }, [props.userProgressData, props.userAttemptsData, props.userQuizData]);


    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {stats != null ?
                    <>
                        <StatCard stat={stats.totalUsers} />
                        <StatCard stat={stats.usageTime} />
                        <StatCard stat={stats.modules} />
                        <StatCard stat={stats.quizzes} />
                        <StatCard stat={stats.averageQuizScore} />
                        <StatCard stat={stats.averageQuizScore} />
                    </>
                : null}
            </div>
            <br/>
            <UserProgressTable progressData={props.userProgressData} quizData={props.userQuizData} />
            <br/>
            <div className="grid grid-cols-3 gap-4">
                <PopularModulesCard 
                    mostPlayed={calcMostPlayed(props.userProgressData)}
                    mostPlayedByUserCount={calcMostPopularByUserCount(props.userProgressData)}
                    mostPlayedTime={calcMostPlayedTime(props.userAttemptsData)}
                />
                <div />
                <QuizCard 
                    totalQuizzes={calcTotalQuizStages(props.userQuizData)}
                    totalQuizAttempts={userQuizData?.length || 0} 
                    completedQuizzes={calcCompletedQuizzes(props.userQuizData)}
                    totalQuizDuration={calcTotalQuizDuration(props.userQuizData)} 
                    averageQuizScore={calcAverageQuizScore(props.userQuizData)} 
                />
            </div>
            <br />
            <div className="grid grid-cols-2 gap-4">
                <MonthlyTotalUserTable 
                    year={2025} 
                    metricName="# Users"
                    data={(getUsersCreatedInTimePeriod(props.userProgressData, new Date("2025-01-01"), new Date("2025-12-31")))}
                />
                <MonthlyTotalUserTable 
                    year={2026} 
                    metricName="# Users"
                    data={(getUsersCreatedInTimePeriod(props.userProgressData, new Date("2026-01-01"), new Date("2026-12-31")))}
                />
            </div>
            
        </>
    )
}