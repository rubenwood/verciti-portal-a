"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TotalUsersCard(props: any){

    if(props.data == null ) { return null; }

    return (
        <Card className="mb-4 p-4">
            <CardHeader className="text-lg font-semibold">
                <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
                {props.data.length}
            </CardContent>
        </Card>
    )
}