"use client"
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { checkUser } from "../db/general/get-user";

import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProfilesByOrgId, getUserAttempts } from "@/app/db/user/user-prog-analytics";
import { getUsersQuizAttempts } from "@/app/db/user/user-quiz-analytics";

import { TopRibbon } from "./components/general/ribbon";
import { AnalyticsDashboard } from "./components/analytics-dashboard"
import { getUserProfile } from "../db/general/utils";


type GroupedAttempts = {
    id: string;
    external_title: string;
    attempts: any[];
};
type GroupedQuiz = {
    stage_id: string;
    attempts: any[];
};
type GroupedQuizActivity = {
    caj_id: string;
    quizzes: GroupedQuiz[];
};

type UserProfileWithAttempts = {
    Id: string,
    Email: string,
    TotalLogins:number,
    TotalUsageTime:number,
    PreviousLogins: any[],
    ActivityAttempts: any[],
    QuizAttempts: any[],
    GroupedActivityAttempts?: GroupedAttempts[],
    GroupedQuizAttempts?: GroupedQuizActivity[],
};

export default function AnalyticsLandingPage(){
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string>("");

    const [totalsData, setTotalsData] = useState<any>();
    const [userProgressData, setUserProgressData] = useState<any[]>();
    const [userAttemptsData, setUserAttemptsData] = useState<any[]>();
    const [userQuizAttemptsData, setUserQuizAttemptsData] = useState<any[]>();
    const [userProfsWithAttempts, setUserProfsWithAttempts] = useState<UserProfileWithAttempts[]>();


    const getAttemptsForId = (userProfAttempt: UserProfileWithAttempts, attemptData: any[], type: string) => {
        const found = attemptData.filter(attempt => attempt.user_id == userProfAttempt.Id);
        switch(type){
            case "activity":
                userProfAttempt.ActivityAttempts = found;
                break;
            case "quiz":
                userProfAttempt.QuizAttempts = found;
                break;
        }        
    }
    const groupAttemptsByKey = (attempts: any[], key: string) => {
        const grouped: Record<string, any[]> = {};

        for (const attempt of attempts) {
            const groupKey = attempt[key];

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }

            grouped[groupKey].push(attempt);
        }

        return Object.entries(grouped).map(([id, attempts]) => ({
            id,
            external_title: attempts[0].external_title,
            attempts
        }));
    };
    const groupQuizAttempts = (attempts: any[]) => {
        const grouped: Record<string, Record<string, any[]>> = {};

        for (const attempt of attempts) {
            const activityId = attempt.caj_id;
            const quizId = attempt.stage_id;

            if (!grouped[activityId]) {
                grouped[activityId] = {};
            }

            if (!grouped[activityId][quizId]) {
                grouped[activityId][quizId] = [];
            }

            grouped[activityId][quizId].push(attempt);
        }

        // convert to array structure for UI
        return Object.entries(grouped).map(([caj_id, quizzes]) => ({
            caj_id,
            quizzes: Object.entries(quizzes).map(([stage_id, attempts]) => ({
                stage_id,
                attempts
            }))
        }));
    };

    const getAllData = async (orgId: string, dbBranch: string, clientToUse: SupabaseClient) => {
        console.log("Getting all data for org:", orgId);

        const resp = await fetch(`/api/analytics/get-totals/${dbBranch}`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orgId:orgId
            })
        });
        const totalsData = await resp.json();
        console.log(totalsData);
        setTotalsData(totalsData);

        const profileData = await getUsersProfilesByOrgId(clientToUse, orgId);
        setUserProgressData(profileData);

        let userProfsWithAttempts: UserProfileWithAttempts[] = [];
        for(const user of profileData){
            let userAttempt: UserProfileWithAttempts = {
                Id: user.id,
                Email: user.data.email,
                TotalLogins:user.total_logins,
                TotalUsageTime:user.total_usage_time,
                PreviousLogins:user.previous_logins,
                ActivityAttempts:[],
                QuizAttempts:[]
            }
            userProfsWithAttempts.push(userAttempt);
        }

        //TODO: use a list of promises to fetch all pages in parallel
        const attempts = await getUserAttempts(clientToUse, profileData.map((user) => user.id), 0, 1000);
        for(let i = 0; i < attempts.pageCount-1; i++){
            const moreAttempts = await getUserAttempts(clientToUse, profileData.map((user) => user.id), i+1, 1000);
            attempts.data = attempts.data.concat(moreAttempts.data);
        }
        setUserAttemptsData(attempts.data);

        const quizData = await getUsersQuizAttempts(clientToUse, profileData.map((user) => user.id));
        for(let i = 0; i < quizData.pageCount-1; i++){
            const moreQuizData = await getUsersQuizAttempts(clientToUse, profileData.map((user) => user.id), i+1, 1000);
            quizData.data = quizData.data.concat(moreQuizData.data);
        }
        setUserQuizAttemptsData(quizData.data);

        for(const user of userProfsWithAttempts){
            getAttemptsForId(user, attempts.data, "activity");
            getAttemptsForId(user, quizData.data, "quiz");
            user.GroupedActivityAttempts = groupAttemptsByKey(user.ActivityAttempts, "activity_id");
            user.GroupedQuizAttempts = groupQuizAttempts(user.QuizAttempts);
        }

        console.log("USER ATT");
        console.log(userProfsWithAttempts);
        setUserProfsWithAttempts(userProfsWithAttempts);
    }

    
    useEffect(() => {
        const init = async () => {
            const users = await checkUser();

            let userRole = "";
            let organisationId = "";
            let supabaseClientToUse = supabaseTest;
            let databaseBranch = "test";

            if (users) {               
                if(users.testUser){ // prefer test user
                    setUser(users.testUser);
                    const profile = await getUserProfile(supabaseTest, users.testUser);
                    userRole = profile?.data?.role || null;
                    organisationId = profile?.org_id || "";
                    supabaseClientToUse = supabaseTest;
                    databaseBranch = "test";
                }else if(users.liveUser){
                    setUser(users.liveUser);
                    const profile = await getUserProfile(supabaseMain, users.liveUser);
                    userRole = profile?.data?.role || null;
                    organisationId = profile?.org_id || "";
                    supabaseClientToUse = supabaseMain;
                    databaseBranch = "live";
                }
            }

            setRole(userRole);

            getAllData(organisationId, databaseBranch, supabaseClientToUse);
        };
        init();

    }, []);

    const isLoaded = userProgressData && userAttemptsData && userQuizAttemptsData;

    if(!user){ return(<p>Not logged in</p>) }

    return (
        <div className="dark bg-background text-foreground">
            {isLoaded ? 
            <>
                <TopRibbon /><br/>
                <AnalyticsDashboard 
                    role={role}
                    totals={totalsData}
                    userProfilesWithAttempts={userProfsWithAttempts}
                    userProgressData={userProgressData}
                    userAttemptsData={userAttemptsData}
                    userQuizData={userQuizAttemptsData}
                />
            </>
            : null }            
        </div>
    )
}