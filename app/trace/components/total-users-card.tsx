"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TotalUsersCard(props: any){

    if(props.data == null ) { return null; }

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader className="text-lg font-semibold">
                <CardTitle className="text-lg font-semibold text-center">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                <p className="text-4xl">{props.data.length}</p>
            </CardContent>
        </Card>
    )
}