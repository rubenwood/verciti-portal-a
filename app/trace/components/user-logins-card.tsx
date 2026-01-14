"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function UserLoginsCard(props: any){

    if(props == null ) { return null; }

    useEffect(() => {
        //console.log("UserLoginsCard props:", props);
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
            <CardContent>
                Last 24 hours: {getLoginsPerUser(props.loginsToday)} (# users: {props.loginsToday.length})<br/>
                Last 7 days: {getLoginsPerUser(props.logins7Days)} (# users: {props.logins7Days.length})<br/>
                Last 30 days: {getLoginsPerUser(props.logins30Days)} (# users: {props.logins30Days.length})<br/>
            </CardContent>
        </Card>
    )
}