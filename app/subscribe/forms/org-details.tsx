"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export function OrganisationDetails(){
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Organisation Details</CardTitle>
                <CardDescription>Please provide your organisation's details below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="email-addr">Email Address</label>
                        <input type="text" id="email-addr" className="border p-2 rounded" placeholder="example@example.com" />
                        <br/>
                        <label htmlFor="org-name">Organisation Name</label>
                        <input type="text" id="org-name" className="border p-2 rounded" placeholder="Enter organisation name" />
                        <br/>
                        <label htmlFor="org-type">Organisation Type</label>
                        <input type="text" id="org-type" className="border p-2 rounded" placeholder="Enter organisation type" />
                    </div>
                    <Button type="submit" className="mt-4 py-2 px-4">Submit</Button>
                </form>
            </CardContent>
        </Card>
        </>
    )
}