"use client"

import { JSX, useEffect } from "react";

export function UserProgressTable(props: any) {
    const findQuizAttemptByActivityAndUser = (quizData: any[], activityId: string, userId: string) => {
        return quizData.find(quiz => quiz.activity_id === activityId && quiz.user_id === userId);
    }

    const populateRows = () => {
        const rows: JSX.Element[] = [];
        if (props.progressData != null) {
            for (const userProg of props.progressData) {
                for (const prog of userProg.generic_activity_progress) {
                    const quizAttempt = findQuizAttemptByActivityAndUser(
                        props.quizData,
                        prog.activity_id,
                        prog.user_id
                    );

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
                                {quizAttempt ? (quizAttempt.score * 100).toFixed(2) : 0} %
                            </td>
                            <td className="text-center border-2">{quizAttempt?.completed_on}</td>
                            <td className="text-center border-2"></td>
                        </tr>
                    );
                }
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
                    <th className="text-center border-2">Score</th>
                    <th className="text-center border-2">Completion Date</th>
                    <th className="text-center border-2">Actions</th>
                </tr>
            </thead>
            <tbody >
                {populateRows()}
            </tbody>
        </table>
    )
}