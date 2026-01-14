"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function UserLoginsCard(props: any){

    if(props == null ) { return null; }

    useEffect(() => {
        console.log("UserLoginsCard props:", props);
    }, [props]);

    return (
        <Card className="mb-4 p-4">
            <CardHeader className="text-lg font-semibold">
                <CardTitle className="text-lg font-semibold text-center">User Logins</CardTitle>
            </CardHeader>
            <CardContent>
                Last 24 hours: {props.loginsToday.length}<br/>
                Last 7 days: {props.logins7Days.length}<br/>
                Last 30 days: {props.logins30Days.length} <br/>
            </CardContent>
        </Card>
    )
}