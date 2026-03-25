"use client"
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { checkUser } from "../db/general/get-user";

import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProfilesByVisibility, getUserAttempts } from "@/app/db/user/user-prog-analytics";
import { getUsersQuizAttempts } from "@/app/db/user/user-quiz-analytics";

import { Button } from "@/components/ui/button";

import { TopRibbon } from "./components/general/ribbon";
import { AnalyticsDashboard } from "./components/analytics-dashboard"
import { getUserProfile } from "../db/general/utils";


// This component is just for dev purposes and will be removed eventually
export function BeginComp(props :any){
    const begin = async () => { 
        await props.getAllData(); 
    }

    if(!props.userProgressData || !props.userAttemptsData || !props.userQuizData){
        return (
            <>
                <select onChange={(e) => { props.setClient(e.target.value); }} value={props.dbBranch}>
                    <option value="test">test</option>
                    <option value="main">main</option>
                </select>
                <br/>
                <input type="text" placeholder="cohort name" onChange={(e) => props.setCohortName(e.target.value)} />
                <Button onClick={begin}>Begin</Button>
                <br/>
            </>
        )
    }

    return (
        <>
            <input type="text" placeholder="cohort name" onChange={(e) => props.setCohortName(e.target.value)} />
            <br/>
            <Button onClick={begin}>Begin</Button>
            <br/>
            Timefame
            <br/>
            start:
            <input type="date" />
            end:
            <input type="date" />
        </>
    )

}


type UserProfileWithAttempts = {
    Id: string,
    Email: string,
    TotalLogins:number,
    TotalUsageTime:number,
    PreviousLogins: any[],
    ActivityAttempts: any[],
    QuizAttempts: any[]
}

export default function AnalyticsLandingPage(){
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string>("");

    const [dbBranch, setDbBranch] = useState<string>("test");
    const [clientToUse, setClientToUse] = useState<SupabaseClient>(supabaseTest);

    const [cohortName, setCohortName] = useState<string>("Verciti");

    const [totalsData, setTotalsData] = useState<any>();
    const [userProgressData, setUserProgressData] = useState<any[]>();
    const [userAttemptsData, setUserAttemptsData] = useState<any[]>();
    const [userQuizAttemptsData, setUserQuizAttemptsData] = useState<any[]>();
    const [userProfsWithAttempts, setUserProfsWithAttempts] = useState<UserProfileWithAttempts[]>();

    const setClient = (branch: string) => {
        setDbBranch(branch);
        if(branch === "test"){
            setClientToUse(supabaseTest);
        } else {
            setClientToUse(supabaseMain);
        }
    }


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

    const getAllData = async () => {
        if(!cohortName || cohortName.trim() === "") {
            alert("Please enter a cohort name.");
            return;
        }

        const resp = await fetch(`/api/analytics/get-totals/${dbBranch}`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orgName:cohortName
            })
        });
        const totalsData = await resp.json();
        console.log(totalsData);
        setTotalsData(totalsData);

        const profileData = await getUsersProfilesByVisibility(clientToUse, cohortName);
        setUserProgressData(profileData);
        console.log("User Profile Data:", profileData);

        let userAttempts: UserProfileWithAttempts[] = [];
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
            userAttempts.push(userAttempt);
        }

        //TODO: use a list of promises to fetch all pages in parallel
        const attempts = await getUserAttempts(clientToUse, profileData.map((user) => user.id), 0, 1000);
        for(let i = 0; i < attempts.pageCount-1; i++){
            const moreAttempts = await getUserAttempts(clientToUse, profileData.map((user) => user.id), i+1, 1000);
            attempts.data = attempts.data.concat(moreAttempts.data);
        }
        setUserAttemptsData(attempts.data);
        //console.log("User Attempts Data:", attempts);

        const quizData = await getUsersQuizAttempts(clientToUse, profileData.map((user) => user.id));
        for(let i = 0; i < quizData.pageCount-1; i++){
            const moreQuizData = await getUsersQuizAttempts(clientToUse, profileData.map((user) => user.id), i+1, 1000);
            quizData.data = quizData.data.concat(moreQuizData.data);
        }
        //console.log(quizData.data);
        setUserQuizAttemptsData(quizData.data);
        //console.log("User Quiz Data:", quizData);

        for(const user of userAttempts){
            getAttemptsForId(user, attempts.data, "activity");
            getAttemptsForId(user, quizData.data, "quiz");
        }

        console.log("USER ATT");
        console.log(userAttempts);
        setUserProfsWithAttempts(userAttempts);
    }

    
    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            if (users) { 
                console.log("US: ");
                console.log(users);
                
                if(users.testUser){ // prefer test user
                    setUser(users.testUser);
                    const profile = await getUserProfile(supabaseTest, users.testUser);
                    setRole(profile?.data?.role || null);
                }else if(users.liveUser){
                    setUser(users.liveUser);
                    const profile = await getUserProfile(supabaseMain, users.liveUser);
                    setRole(profile?.data?.role || null);
                }                
            }
        };
        init();
    }, []);

    const isLoaded = userProgressData && userAttemptsData && userQuizAttemptsData;

    if(!user){ return(<p>Not logged in</p>) }

    return (
        <div className="dark bg-background text-foreground">
            <BeginComp 
                dbBranch={dbBranch}
                setClient={setClient}
                cohortName={cohortName}
                setCohortName={setCohortName}
                getAllData={getAllData}
                userProgressData={userProgressData}
                userAttemptsData={userAttemptsData}
                userQuizData={userQuizAttemptsData}
            />
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