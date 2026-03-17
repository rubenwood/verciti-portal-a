"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TotalUsersCard(props: any){

    if(props.totalUsers == null ) { return null; }

    const toggleBreakdown = () => {
        console.log("TotalUsersCard clicked");
    }

    return (
        <Card className="mb-4 p-4 flex flex-col" onClick={toggleBreakdown}>
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-center">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <p className="text-2xl text-justify">{props.totalUsers}</p><br/>                
            </CardContent>
        </Card>
    )
}