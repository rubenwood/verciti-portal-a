"use client"
import { useEffect, useState } from "react";

export function MonthlyTotalUserTable(props: any){
    return (
        <MonthlyTable year={props.year} metricName="Total Users">
            <MontlyTotalUsersTableBody year={props.year} data={props.data} />
        </MonthlyTable>
    )
}
export function MontlyTotalUsersTableBody(props: any){
    const monthlyData = [
        {year:props.year, month:"Jan", users:0},
        {year:props.year, month:"Feb", users:0}, 
        {year:props.year, month:"Mar", users:0},
        {year:props.year, month:"Apr", users:0},
        {year:props.year, month:"May", users:0},
        {year:props.year, month:"Jun", users:0},
        {year:props.year, month:"Jul", users:0},
        {year:props.year, month:"Aug", users:0},
        {year:props.year, month:"Sep", users:0},
        {year:props.year, month:"Oct", users:0},
        {year:props.year, month:"Nov", users:0},
        {year:props.year, month:"Dec", users:0}
    ];
    const [monthlyDataState, setMonthlyDataState] = useState(monthlyData);

    const calculateMonthlyData = () => {
        for(const user of props.data){
            const createdAt = new Date(user.created_at);
            const monthIndex = createdAt.getMonth();            
            const year = createdAt.getFullYear();

            if(year == props.year) { 
                monthlyData[monthIndex].users += 1;
            }
        }

        setMonthlyDataState(monthlyData);
    }

    useEffect(() => {
        calculateMonthlyData();
    }, [props.data]);

    return (
        <tbody>
            {monthlyDataState.map((monthData, index) => (
                <tr key={index}>
                    <td className="text-center border-2">{monthData.month}</td>
                    <td className="text-center border-2">{monthData.users}</td>
                </tr>
            ))}
        </tbody>
    );
}

export function MonthlyModulesCompletedTable(props: any){
    <MonthlyTable year={props.year} metricName="Total Modules Completed">
        <MonthlyModulesCompletedTableBody year={props.year} data={props.data} />
    </MonthlyTable>
}
export function MonthlyModulesCompletedTableBody(props: any){
    return null;
}


export function MonthlyTotalUsageTimeTable(props: any){
    <MonthlyTable year={props.year} metricName="Total Usage Time">
        <MonthlyTotalUsageTimeTableBody year={props.year} data={props.data} />
    </MonthlyTable>
}
export function MonthlyTotalUsageTimeTableBody(props: any){
    return null;
}


export function MonthlyTable(props: any){
    return (
        <div className="w-50">
            <p>{props.year}</p>
            <table className="w-full mb-4 border-collapse border border-gray-300">
                <thead className="bg-[#333333]">
                    <tr>
                        <td className="text-center border-2">Month</td>
                        <td className="text-center border-2">{props.metricName}</td>
                    </tr>
                </thead>
                {props.children}
            </table>
        </div>
    )

}