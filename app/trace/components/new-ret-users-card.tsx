"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function NewRetUsersCard(props: any){

    if(props.data == null ) { return null; }

    return (
        <Card className="mb-4 p-4">
            <CardHeader className="text-lg font-semibold">
                <CardTitle className="text-lg font-semibold text-center">New & Returning Users</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                New:<br/>
                Returning:<br/>
            </CardContent>
        </Card>
    )
}