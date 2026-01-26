"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";

export function QuizCard(props: any){

    const toggleBreakdown = () => {
        console.log("QuizCard clicked");
    }

    return (
        <Card className="mb-4 p-4 flex flex-col" onClick={toggleBreakdown}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                    Quiz
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <span className="grid grid-cols-2 border-b-2 border-t-2 w-full">
                    <p className="border-1 p-1">Total Quizzes attempted</p>
                    <p className="border-1 p-1">{props.totalQuizzes}</p>
                    <p className="border-1 p-1">Total Quiz attempts</p>
                    <p className="border-1 p-1">{props.totalQuizAttempts}</p>
                    <p className="border-1 p-1">Total Quizzes completed</p>
                    <p className="border-1 p-1">{props.completedQuizzes.length}</p>
                    <p className="border-1 p-1">Total Time spent</p>
                    <p className="border-1 p-1">{formatDuration(props.totalQuizDuration)}</p>
                    <p className="border-1 p-1">Average Quiz score</p>
                    <p className="border-1 p-1">{(props.averageQuizScore * 100).toFixed(2)}%</p>
                </span>          
            </CardContent>
        </Card>
    )
}