import Link from "next/link";

export default function ToolsDashboard(){
    return(
        <>
            <h1 className="header">Here you will find various tools</h1>
            <div>
                <ul>
                    <li>
                        <Link href="/tools/printable-applicant-form">Printable Applicant Form</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}