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
import BatchSynthesia from "../db/synthesia/synthesia-component"
import InfoTextEditor from "../db/activities/info-text/info-text-editor-component"
import QuizUploader from "../db/activities/quiz/quiz-upload-component"
import QuizEditor from "../db/activities/quiz/quiz-editor-component"
import StageOrderer from "../db/activities/editor/stage-order-component"
import ActivityEditorSimple from "../db/activities/editor/activity-editor-simple-component"

export default function LMSDashboard(){
    const [courseConfigVisible, setCourseConfigVisible] = useState(false);
    const [batchToolsVisible, setbatchToolsVisible] = useState(false);
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
                <h1 className="text-2xl">Verciti Content Dashboard</h1>
            </div>
            <br/>
            <Link href="/model-browser" className="link-button">
                Browse Models
            </Link>
            <br/>
            <Button className="green-shadcn-button" onClick={() => setCourseConfigVisible(!courseConfigVisible)}>
                {courseConfigVisible ? "Hide Course Config" : "Show Course Config"}</Button>
            <br/>
            <Button className="green-shadcn-button" onClick={() => setbatchToolsVisible(!batchToolsVisible)}>
                {batchToolsVisible? "Hide Batch Tools" : "Show Batch Tools"}</Button>
            
            {
            courseConfigVisible ? 
                <>
                    {/* <CoursesTable />
                    <br/>
                    <ActivitiesTable />
                    <br/>*/}
                    <CourseActivityJoinTable />
                </> : null
            }
            <br/>
            {
                batchToolsVisible ?
                <>
                <InfoTextUploader />
                <br/>
                <BatchDelete />
                <br/>
                <BatchSynthesia />
                <br/>
                <QuizUploader />
                </> : null
            }
            
            <br/>
            <InfoTextEditor />
            <br/>
            <QuizEditor />
            <br/>
            <StageOrderer />
            {/* <ActivityEditor /> */}
            <br/>
            <ActivityEditorSimple />
        </>
    )
}