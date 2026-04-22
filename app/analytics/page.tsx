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
import { getUserProfile, fetchCourseActivityByVisibility } from "../db/general/utils";


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

    const [allData, setAllData] = useState<any>(null);


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

    const getAllData = async (orgId: string, contentTags: string[], dbBranch: string, clientToUse: SupabaseClient) => {

        // const cajIds = ["bff8bd2b-45fa-414e-8978-a05b413a2f85",
        //                 "a1c89ec8-8443-4580-9dba-b0de438f1e81",
        //                 "22ea85c5-a87b-44f7-bc3b-90665bd248d1",
        //                 "131f7257-1134-4834-9624-cf30607313d4",
        //                 "9625426c-9614-4ba9-93ea-9b6e80cf6d96",
        //                 "77d24f2b-7047-4920-9729-47d023f0f722",
        //                 "8ac778e7-f9cc-44bf-adc8-ff571e3f5b69",
        //                 "780871eb-64da-40f0-b27c-440f10d2c917",
        //                 "54d9bf8c-455c-44b6-ac1c-5b138faa9a39",
        //                 "e91b2b06-6796-463b-84c9-7cf118381521",
        //                 "e30f4528-e20b-48e6-a06a-dd6217195cee",
        //                 "e8626247-f46c-42ba-9214-f5cbddc14889",
        //                 "93756839-3ff3-4803-a2b2-567344edc576",
        //                 "4188ba90-1549-4b79-a124-31bce009f504",
        //                 "a685241f-6b8a-49ac-8a0f-197a760a2bbd",
        //                 "f23ef4d4-2391-47b5-8fba-0f508537f63b",
        //                 "4c2cead9-ac38-42ec-8a54-ebb669dda737",
        //                 "786f19aa-0290-4bfa-bf8e-c1108ae39454",
        //                 "45eb5e67-2f56-407d-8f11-ccdbc4e62a0f",
        //                 "fede6a85-5103-41a6-8350-f1fb97a72eb6",
        //                 "929c2968-be03-4643-ad88-5a76866925d1",
        //                 "25a71c51-cae1-49ff-862c-6a0dbf2cd9f3",
        //                 "f2c1ccfc-3d03-4c0d-a3df-d65194fae979",
        //                 "d0fd15f3-31ac-4735-82b2-77c11ddf194a"];
        // populateStageActivityJoin(clientToUse, cajIds);

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


        const courseActivitiesForOrg = await fetchCourseActivityByVisibility(clientToUse, contentTags);
        console.log("Course activities for org:", courseActivitiesForOrg);

        const profileData = await getUsersProfilesByOrgId(clientToUse, orgId);

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

        const quizData = await getUsersQuizAttempts(clientToUse, profileData.map((user) => user.id));
        for(let i = 0; i < quizData.pageCount-1; i++){
            const moreQuizData = await getUsersQuizAttempts(clientToUse, profileData.map((user) => user.id), i+1, 1000);
            quizData.data = quizData.data.concat(moreQuizData.data);
        }

        for(const user of userProfsWithAttempts){
            getAttemptsForId(user, attempts.data, "activity");
            getAttemptsForId(user, quizData.data, "quiz");
            user.GroupedActivityAttempts = groupAttemptsByKey(user.ActivityAttempts, "activity_id");
            user.GroupedQuizAttempts = groupQuizAttempts(user.QuizAttempts);
        }

        return {
            totalsData: totalsData,
            orgCoursesActivities: courseActivitiesForOrg.data,
            userProgressData: profileData,
            userAttemptsData: attempts.data,
            userQuizAttemptsData: quizData.data,
            userProfsWithAttempts: userProfsWithAttempts
        }
    }
    
    useEffect(() => {
        const init = async () => {
            const users = await checkUser();

            let userRole = "";
            let organisationId = "";
            let contentTags: string[] = [];
            let supabaseClientToUse = supabaseTest;
            let databaseBranch = "test";

            if (users) {               
                if(users.testUser){ // prefer test user
                    setUser(users.testUser);
                    const profile = await getUserProfile(supabaseTest, users.testUser);
                    console.log(profile);
                    userRole = profile?.data?.role || null;
                    organisationId = profile?.org_id || "";
                    contentTags = profile?.org_access?.content_tags || [];
                    supabaseClientToUse = supabaseTest;
                    databaseBranch = "test";
                }else if(users.liveUser){
                    setUser(users.liveUser);
                    const profile = await getUserProfile(supabaseMain, users.liveUser);
                    userRole = profile?.data?.role || null;
                    organisationId = profile?.org_id || ""; 
                    contentTags = profile?.org_access?.content_tags || [];
                    supabaseClientToUse = supabaseMain;
                    databaseBranch = "live";
                }
            }            

            setRole(userRole);

            const output = await getAllData(organisationId, contentTags, databaseBranch, supabaseClientToUse);
            console.log("Data fetched in init:", output);
            const result = {
                totalsData: output.totalsData,
                client: supabaseClientToUse,
                orgCoursesActivities: output.orgCoursesActivities,
                userProgressData: output.userProgressData,
                userAttemptsData: output.userAttemptsData,
                userQuizAttemptsData: output.userQuizAttemptsData,
                userProfsWithAttempts: output.userProfsWithAttempts
            };
            console.log("All data fetched:", result);
            setAllData(result);
        };
        init();

    }, []);

    const isLoaded = allData != null;

    if(!user){ return(<p>Not logged in</p>) }

    return (
        <div className="dark bg-background text-foreground">
            {isLoaded ? 
            <>
                <TopRibbon /><br/>
                <AnalyticsDashboard 
                    role={role}
                    totals={allData.totalsData}
                    supabaseClient={allData.client}
                    orgCoursesActivities={allData.orgCoursesActivities}
                    userProfilesWithAttempts={allData.userProfsWithAttempts}
                    userProgressData={allData.userProgressData}
                    userAttemptsData={allData.userAttemptsData}
                    userQuizData={allData.userQuizAttemptsData}
                />
            </>
            : null }            
        </div>
    )
}