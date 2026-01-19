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
                Total Quizzes attempted: {props.totalQuizzes} <br/>              
                Total Quiz attempts: {props.totalQuizAttempts}<br/>              
                Total Quizzes completed: {props.completedQuizzes.length}<br/>              
                Total Time spent: {formatDuration(props.totalQuizDuration)}<br/>              
                Average Quiz score: {(props.averageQuizScore * 100).toFixed(2)}%<br/>              
            </CardContent>
        </Card>
    )
}