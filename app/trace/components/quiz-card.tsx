"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                <p>Total Quizzes attempted: {props.totalQuizzes} </p><br/>              
                <p>Total Quiz attempts: {props.totalQuizAttempts} </p><br/>              
                <p>Total Quizzes completed: {props.completedQuizzes.length}</p><br/>              
                <p>Total Time spent: </p><br/>              
                <p>Average Quiz score: </p><br/>              
            </CardContent>
        </Card>
    )
}