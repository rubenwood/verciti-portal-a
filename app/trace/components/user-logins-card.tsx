"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react";


export function UserLoginsCard(props: any){

    if(props == null ) { return null; }

    useEffect(() => {
    }, [props]);


    const getLoginsPerUser = (loginData: any[]) => {
        let totalLogins = 0;
        for(const user of loginData){
            totalLogins += user.previous_logins.length;
        }
        return totalLogins;
    }

    return (
        <Card className="mb-4 p-4">
            <CardHeader className="text-lg font-semibold">
                <CardTitle className="text-lg font-semibold text-center">User Logins</CardTitle>
            </CardHeader>
            <CardContent className="gridflex flex-1 items-center justify-center">
                <span className="grid grid-cols-3 border-b-2 border-t-2 w-full">
                <p className="border-1 p-1">Last 24 hours</p>
                <p className="border-1 p-1">{getLoginsPerUser(props.loginsToday)}</p>
                <p className="border-1 p-1">{props.loginsToday.length} <User className="size-4"/></p>
                <p className="border-1 p-1">Last 7 days</p>
                <p className="border-1 p-1">{getLoginsPerUser(props.logins7Days)}</p>
                <p className="border-1 p-1">{props.logins7Days.length} <User className="size-4"/></p>
                <p className="border-1 p-1">Last 30 days</p>
                <p className="border-1 p-1">{getLoginsPerUser(props.logins30Days)}</p>
                <p className="border-1 p-1">{props.logins30Days.length} <User className="size-4"/></p>
                </span>
            </CardContent>
        </Card>
    )
}