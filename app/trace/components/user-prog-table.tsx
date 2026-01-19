"use client"

export function UserProgressTable(props: any) {
    const findQuizAttemptByActivityAndUser = (quizData: any[], activityId: string, userId: string) => {
        return quizData.find(quiz => quiz.activity_id === activityId && quiz.user_id === userId);
    }

    return (
        <table className="w-full mb-4 border-collapse border border-gray-300">
            <thead className="bg-[#333333]">
                <tr>
                    <th className="text-center border-2">User</th>
                    <th className="text-center border-2">Module</th>
                    <th className="text-center border-2">Progress</th>
                    <th className="text-center border-2">Score</th>
                    <th className="text-center border-2">Actions</th>
                </tr>
            </thead>
            <tbody >
                {props.progressData != null ? 
                    props.progressData.map((userProg: any) => (
                        userProg.generic_activity_progress.map((prog: any) => (
                            <tr key={`${userProg.id}-${prog.activity_id}`}>
                                <td className="text-center border-2">{userProg.data.email}</td>
                                <td className="text-center border-2">{prog.external_title}</td>
                                <td className="text-center border-2">{Math.round(prog.completion * 100)} %</td>
                                <td className="text-center border-2">{
                                    findQuizAttemptByActivityAndUser(
                                        props.quizData, 
                                        prog.activity_id, 
                                        prog.user_id)?.score.toFixed(2)*100 || 0} %
                                    </td>
                                <td className="text-center border-2"></td>
                            </tr>
                    ))
                )): null}
            </tbody>
        </table>
    )
}