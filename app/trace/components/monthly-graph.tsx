"use client"
import { useEffect, useState } from "react";

export function MonthlyGraph(props: any){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
                    {months.map((month, index) => (
                        <tr key={month}>
                            <td className="text-center border-2">{month}</td>
                            <td className="text-center border-2">test 0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}