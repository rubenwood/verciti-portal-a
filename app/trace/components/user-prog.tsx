"use client"
import { useEffect, useState } from "react";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { getUsersProgress, getUsersProgressByVisibility } from "@/app/db/user/user-prog";

import Image from "next/image";
import { Button } from "@/components/ui/button";


function UserProgressTable(props: any) {
    return (
        <table className="w-full mb-4 border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="text-center border-2">User ID</th>
                    <th className="text-center border-2">Email</th>
                    <th className="text-center border-2">Activity ID</th>
                    <th className="text-center border-2">Completion</th>
                </tr>
            </thead>
            <tbody >
                {props.userProgress !=null ? 
                    props.userProgress.map((userProg: any) => (
                        userProg.generic_activity_progress.map((prog: any) => (
                            <tr key={`${userProg.id}-${prog.activity_id}`}>
                                <td className="text-center border-2">{userProg.id}</td>
                                <td className="text-center border-2">{userProg.data.email}</td>
                                <td className="text-center border-2">{prog.caj_id}</td>
                                <td className="text-center border-2">{prog.completion}</td>
                            </tr>
                    ))
                )): null}
            </tbody>
        </table>
    )
}

export function UserProgress(){
    const [userProgressData, setUserProgressData] = useState<any[]>();

    const getUserProgressData = () => {
        // Placeholder function to fetch user progress data
        return [];
    }

    const begin = async () => {
        const data = await getUsersProgressByVisibility(supabaseTest, "Verciti");
        setUserProgressData(data);
        console.log("User Progress Data:", data);
    }
    
    useEffect(() => {
        
    }, [userProgressData]);


    return (
        <>
            <Button onClick={begin}>Begin</Button><br/>
            {userProgressData !== null ?
                <UserProgressTable userProgress={userProgressData} />
            : null}
        </>       
    )
}