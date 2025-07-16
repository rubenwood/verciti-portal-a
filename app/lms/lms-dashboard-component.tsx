"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import CoursesTable from "../db/courses/courses-table-component"
import ActivitiesTable from "../db/activities/activities-table-component"
import CourseActivityJoinTable from "../db/caj/caj-table-component"
import InfoTextUploader from "../db/activities/info-text/info-text-upload-component"

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { checkUser } from "../db/general/get-user"
import ActivityEditor from "../db/activities/editor/activity-editor-component"
import BatchDelete from "../db/activities/editor/batch-delete-component"

export default function LMSDashboard(){
    const [courseConfigVisible, setCourseConfigVisible] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { setUser(user); }
        };
        init();
    }, []);

    if(!user){ return <p>Not logged in</p> }

    return (
        <>
            <div>
                <h1 className="text-2xl">LMS Dashboard</h1>
                <p className="text-lg">Welcome to the LMS Dashboard</p>
                <p className="text-lg">This is a placeholder for the LMS dashboard.</p>
            </div>
            <br/>
            <Link href="/model-browser" className="button">
                Browse Models
            </Link>
            <br/>
            <Button className="green-shadcn-button" onClick={() => setCourseConfigVisible(!courseConfigVisible)}>
                {courseConfigVisible ? "Hide Course Config" : "Show Course Config"}</Button>
            {
            courseConfigVisible ? 
                <>
                    {/* <CoursesTable />
                    <br/>
                    <ActivitiesTable />
                    <br/> */}
                    <CourseActivityJoinTable />
                </> : null
            }
            <br/>
            <InfoTextUploader />
            <br/>
            <BatchDelete />
            <br/>
            <ActivityEditor />
        </>
    )
}