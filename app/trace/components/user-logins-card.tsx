"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function UserLoginsCard(props: any){

    if(props.data == null ) { return null; }

    return (
        <Card className="mb-4 p-4">
            <CardHeader className="text-lg font-semibold">
                <CardTitle>User Logins</CardTitle>
            </CardHeader>
            <CardContent>
                Last 24 hours:<br/>
                1 day ago:<br/>
                7 days ago:<br/>
                30 days ago: <br/>
            </CardContent>
        </Card>
    )
}