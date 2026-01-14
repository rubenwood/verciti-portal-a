"use client"
import { useEffect, useState } from "react";

export function MonthlyGraph(props: any){
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
            if(year !== props.year) { continue; }
            monthlyData[monthIndex].users += 1;
            console.log(monthlyData[monthIndex]);
        }

        console.log("Monthly data calculated:", monthlyData);
        setMonthlyDataState(monthlyData);
    }

    useEffect(() => {
        calculateMonthlyData();
    }, [props.data]);

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
                <tbody>
                    {monthlyDataState.map((element, index) => (
                        element.year === props.year ? (
                            <tr key={element.month}>
                                <td className="text-center border-2">{element.month}</td>
                                <td className="text-center border-2">{element.users}</td>
                            </tr>
                        ) : null
                    ))}
                </tbody>
            </table>
        </div>
    )

}