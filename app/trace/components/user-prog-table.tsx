"use client"

import { Button } from "@/components/ui/button";
import { JSX, useEffect, useState } from "react";


function QuizScoresDetailElement(props: any){
    return (
        <span key={props.attempt.id}>
            Score: {(props.attempt.score * 100).toFixed(2)}% <br/>
            Achieved On: {props.attempt.attempted_at || ""}<br/>
            Completed On: {props.attempt.completed_on || ""}<br/>
        </span>
    )
}

function QuizScoresDisplay(props: any){
    const [detailsVisible, setDetailsVisible] = useState(false);

    const populateAllScoresDetails = (quizAttempts: any[]) => {
        const elements: JSX.Element[] = [];
        quizAttempts.map(attempt => {
            elements.push(
                <>
                    <br/>
                    <QuizScoresDetailElement key={attempt.id} attempt={attempt} />
                </>
            );
        });

        return elements;
    }

    useEffect(() => {

    }, [detailsVisible]);

    const showDetails = () => {
        setDetailsVisible(!detailsVisible);
    }

    const getPrimaryScore = (quizAttempts: any[]) => {
        const attemptToDisplay = quizAttempts.find(attempt => attempt.completed_on != null && attempt.completed_on !== "");
        if(attemptToDisplay){
            return (
                <span key={attemptToDisplay?.id} className="cursor-pointer underline">
                    {(attemptToDisplay?.score * 100).toFixed(2)}%
                </span>
            )
        }else if(quizAttempts.length > 0){
            return (
                <span key={quizAttempts[0]?.id} className="cursor-pointer underline">
                    {(quizAttempts[0]?.score * 100).toFixed(2)}%
                </span>
            )
        }else{
            return <span className="text-gray-500">N/A</span>;
        }
        
    }

    return (
        <span onClick={showDetails}>
            {getPrimaryScore(props.quizAttempts)}
            {detailsVisible ? 
                populateAllScoresDetails(props.quizAttempts) : <></>}        
        </span>
    )
}

export function UserProgressTable(props: any) {
    const findQuizAttemptsByActivityAndUser = (quizData: any[], activityId: string, userId: string) => {
        const quizAttemptsByUserInActivity = quizData.filter(quiz => quiz.activity_id === activityId && quiz.user_id === userId);
        if(quizAttemptsByUserInActivity.length === 0){
            return [];
        }

        return quizAttemptsByUserInActivity;
    }

    const populateRows = () => {
        const rows: JSX.Element[] = [];
        if (props.progressData == null) { return rows; }

        for (const userProg of props.progressData) {
            for (const prog of userProg.generic_activity_progress) {

                rows.push(
                    <tr key={`${userProg.id}-${prog.activity_id}`}>
                        <td className="text-center border-2">
                            {userProg.data.email}
                        </td>
                        <td className="text-center border-2">
                            {prog.external_title}
                        </td>
                        <td className="text-center border-2">
                            {Math.round(prog.completion * 100)} %
                        </td>
                        <td className="text-center border-2">
                            <QuizScoresDisplay quizAttempts={findQuizAttemptsByActivityAndUser(props.quizData, prog.activity_id, userProg.id)} />
                        </td>
                        <td className="text-center border-2"></td>
                        <td className="text-center border-2"></td>
                    </tr>
                );
            }
        }
        return rows;
    }

    return (
        <table className="w-full mb-4 border-collapse border border-gray-300">
            <thead className="bg-[#333333]">
                <tr>
                    <th className="text-center border-2">User</th>
                    <th className="text-center border-2">Module</th>
                    <th className="text-center border-2">Progress</th>
                    <th className="text-center border-2">Score(s)</th>
                    <th className="text-center border-2">100% Date</th>
                    <th className="text-center border-2">Actions</th>
                </tr>
            </thead>
            <tbody >
                {populateRows()}
            </tbody>
        </table>
    )
}