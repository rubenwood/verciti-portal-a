"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModulesCard(props: any){
    useEffect(() => {

    }, [props]);    

    return (
        <Card className="mb-4 p-4 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Total Modules Completed
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
                <p className="text-4xl">{props.uniqueModulesCompleted} ({props.totalModulesCompleted})</p>
            </CardContent>
        </Card>
    )
}