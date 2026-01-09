"use client"


function UserProgressTable(props: any) {
    return (
        <table className="w-full mb-4 border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="text-center border-2">Email</th>
                    <th className="text-center border-2">Activity ID</th>
                    <th className="text-center border-2">Completion</th>
                </tr>
            </thead>
            <tbody >
                {props.userProgress !=null ? 
                    props.userProgress.map((userProg: any) => (
                        userProg.generic_activity_progress.map((prog: any) => (
                            <tr key={`${userProg.id}-${prog.activity_id}`}>
                                <td className="text-center border-2">{userProg.data.email}</td>
                                <td className="text-center border-2">{prog.caj_id}</td>
                                <td className="text-center border-2">{prog.completion}</td>
                            </tr>
                    ))
                )): null}
            </tbody>
        </table>
    )
}

export function UserProgress(props: any){

    return (
        <>
            {props.data !== null ?
                <UserProgressTable userProgress={props.data} />
            : null}
        </>       
    )
}