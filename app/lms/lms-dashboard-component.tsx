"use client"
import Link from "next/link"
import ActivitiesTable from "../db/activities/activities-table-component"

export default function LMSDashboard(){
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
            <ActivitiesTable />
        </>
    )
}