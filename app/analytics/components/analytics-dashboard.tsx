"use client"
import { useEffect, useMemo, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProgress,
    getUsersProfilesByVisibility,
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
import { UserProgressTable } from "./tables/user-prog-table";

import { StatCard } from "./general/stat-card";
import { PopularModulesCard } from "./cards/popular-modules-card";
import { QuizCard } from "./cards/quiz-card";
import { MonthlyTable, MonthlyTotalUserTable } from "./tables/monthly-table";
import { 
    calcAverageQuizScore, 
    calcCompletedQuizzes,
    calcTotalQuizDuration, 
    calcTotalQuizStages,
    getUsersQuizAttempts
} from "@/app/db/user/user-quiz-analytics";
import { BookIcon, BrainIcon, ClockIcon, TrendingUp, TrophyIcon, UsersIcon, Key } from "lucide-react";
import { formatDuration } from "@/app/db/general/utils";
import { UserQuizTable } from "./tables/user-quiz-table";
import { PlatformTotalsTable } from "./tables/platform-totals-table";
import { ActivityProgressTable } from "./tables/activity-prog-table";


export function AnalyticsDashboard(props: any) {
    // Stats
    const stats = useMemo(() => {
        if (!props.totals) return null;

        return {
            totalUsers: {
                label: "Total Users",
                value: props.totals.total_users,
                change: "",
                icon: UsersIcon,
            },
            usageTime: {
                label: "Total Usage Time",
                value: formatDuration(props.totals.total_usage_time),
                change: "",
                icon: ClockIcon,
            },
            modules: {
                label: "Modules Completed",
                value: props.totals.activities_completed,
                change: "",
                icon: BookIcon,
            },
            quizzes: {
                label: "Assessment Attempts",
                value: props.totals.quiz_attempts,
                change: "",
                icon: TrophyIcon,
            },
            averageQuizScore:{
                label: "Average Score",
                value: `${(props.totals.average_score*100).toFixed(2)}%`,
                change: "",
                icon: TrendingUp
            },
            licencesRemaining:{
                label:"Licences Remaining",
                value:195,
                change:"",
                icon:Key
            }
        };
    }, [props.userProgressData, props.userAttemptsData, props.userQuizData]);


    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {stats != null ?
                    <>
                        <StatCard stat={stats.totalUsers} />
                        <StatCard stat={stats.usageTime} />
                        <StatCard stat={stats.modules} />
                        <StatCard stat={stats.quizzes} />
                        <StatCard stat={stats.averageQuizScore} />
                        <StatCard stat={stats.licencesRemaining} />
                    </>
                : null}
            </div>
            <br/>
            {/* Upper Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <PopularModulesCard 
                    mostPlayed={calcMostPlayed(props.userProgressData)}
                    mostPlayedByUserCount={calcMostPopularByUserCount(props.userProgressData)}
                    mostPlayedTime={calcMostPlayedTime(props.userAttemptsData)}
                />
                <QuizCard 
                    totalQuizzes={calcTotalQuizStages(props.userQuizData)}
                    totalQuizAttempts={props.userQuizData?.length || 0} 
                    completedQuizzes={calcCompletedQuizzes(props.userQuizData)}
                    totalQuizDuration={calcTotalQuizDuration(props.userQuizData)} 
                />
            </div>
            <ActivityProgressTable 
                orgCoursesActivities={props.orgCoursesActivities}
                userProgressData={props.userProgressData}
                userProfilesWithAttempts={props.userProfilesWithAttempts} 
                supabaseClient={props.supabaseClient}
            />
            <br/>
            <UserProgressTable 
                userProfilesWithAttempts={props.userProfilesWithAttempts} 
            />
            <br/>
            <UserQuizTable 
                userProfilesWithAttempts={props.userProfilesWithAttempts}
                progressData={props.userProgressData}
                quizData={props.userQuizData}
            />
            <br />
            {props.role != null && props.role == "admin" ?
                <div className="grid grid-cols-2 gap-4">
                    <PlatformTotalsTable />
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
            : null}            
        </div>
    )
}