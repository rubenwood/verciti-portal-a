"use client"
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { checkUser } from "../db/general/get-user";

import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProgressByVisibility, getUserAttempts } from "@/app/db/user/user-prog-analytics";
import { getUsersQuizAttempts } from "@/app/db/user/user-quiz-analytics";

import { Button } from "@/components/ui/button";

import { TopRibbon } from "./components/general/ribbon";
import { AnalyticsDashboard } from "./components/analytics-dashboard"


// This component is just for dev purposes and will be removed eventually
export function BeginComp(props :any){
    const begin = async () => { await props.getAllData(); }

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


export default function AnalyticsLandingPage(){
    const [user, setUser] = useState<User | null>(null);

    const [dbBranch, setDbBranch] = useState<string>("test");
    const [clientToUse, setClientToUse] = useState<SupabaseClient>(supabaseTest);

    const [cohortName, setCohortName] = useState<string>("Verciti");

    const [userProgressData, setUserProgressData] = useState<any[]>();
    const [userAttemptsData, setUserAttemptsData] = useState<any[]>();
    const [userQuizData, setUserQuizData] = useState<any[]>();

    const setClient = (branch: string) => {
        setDbBranch(branch);
        if(branch === "test"){
            setClientToUse(supabaseTest);
        } else {
            setClientToUse(supabaseMain);
        }
    }

    const getAllData = async () => {
        if(!cohortName || cohortName.trim() === "") {
            alert("Please enter a cohort name.");
            return;
        }

        const data = await getUsersProgressByVisibility(clientToUse, cohortName);
        setUserProgressData(data);
        //console.log("User Progress Data:", data);

        //TODO: use a list of promises to fetch all pages in parallel
        const attempts = await getUserAttempts(clientToUse, data.map((user) => user.id), 0, 1000);
        for(let i = 0; i < attempts.pageCount-1; i++){
            const moreAttempts = await getUserAttempts(clientToUse, data.map((user) => user.id), i+1, 1000);
            attempts.data = attempts.data.concat(moreAttempts.data);
        }
        setUserAttemptsData(attempts.data);
        //console.log("User Attempts Data:", attempts);

        const quizData = await getUsersQuizAttempts(clientToUse, data.map((user) => user.id));
        for(let i = 0; i < quizData.pageCount-1; i++){
            const moreQuizData = await getUsersQuizAttempts(clientToUse, data.map((user) => user.id), i+1, 1000);
            quizData.data = quizData.data.concat(moreQuizData.data);
        }
        console.log(quizData.data);
        setUserQuizData(quizData.data);
        //console.log("User Quiz Data:", quizData);
    }

    
    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            if (users) { setUser(users.testUser); }
        };
        init();
    }, []);

    const isLoaded = userProgressData && userAttemptsData && userQuizData;

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
                userQuizData={userQuizData}
            />
            {isLoaded ? 
            <>
                <TopRibbon /><br/>
                <AnalyticsDashboard 
                    userProgressData={userProgressData}
                    userAttemptsData={userAttemptsData}
                    userQuizData={userQuizData}
                />
            </>
            : null }            
        </div>
    )
}