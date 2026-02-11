'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

import { User } from '@supabase/supabase-js'
import { checkUser } from "../../db/general/get-user"
import Login from '../../login/login-component'
import { fetchActivities, getUserProfile } from "../../db/general/utils";

import { supabaseTest, supabaseMain } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function ActivityStageJoiner(){
    const [testUser, setTestUser] = useState<User | null>(null);
    const [liveUser, setLiveUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const users = await checkUser();
            if (users && users.testUser) { 
                setTestUser(users.testUser);
                setLiveUser(users.liveUser);
                const profile = await getUserProfile(supabaseTest, users.testUser);
                setRole(profile?.data?.role || null);
            }
        };
        init();
    })

    const joinStagesToActivites = async () => {
        const resp = await fetchActivities(supabaseTest);
        if(resp instanceof Error || 'error' in resp){ 
            console.log("Error fetching activities");
            return;
        }
        
        const activities = resp as Activity[];
        console.log(activities);
        let queryPromises = [];

        
        const limit = 1;
        let current = 0;

        for(const activity of activities){
            if(current >= limit) break; // Stop outer loop if limit is reached

            console.log(activity);
            
            for(const stageId of activity.params.stage_ids){
                if(current >= limit) break; // Stop inner loop if limit is reached

                let newEntry = {
                    stage_id: stageId,
                    activity_id: activity.id, // need to find this in caj
                    stage_type: null, // get this from stages table
                    stage_index: activity.params.stage_ids.indexOf(stageId)
                }
                queryPromises.push(supabaseTest.from('stage_activity_join').upsert(newEntry));
                
                current++;
            }            
        }

        // execute all queries
        await Promise.all(queryPromises);
        console.log("DONE");
    }

    if(!testUser){ return <Login setUserFunc={setTestUser} user={testUser} /> }
    if(role !== "admin"){ return <p>Not logged in</p> }

    return(
        <>
            <h1 className="header">Here you will find various tools</h1>
            <br/>
            <div className="center-col">
                <Button onClick={joinStagesToActivites}>Join</Button>
            </div>
        </>
    )
}