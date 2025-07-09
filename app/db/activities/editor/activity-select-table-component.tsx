"use client"
import { fetchActivities } from "../../general/utils";
import { useEffect, useState,  } from "react";
import { Button } from "@/components/ui/button";

export default function ActivitySelectTable(props:any){
    const [activities, setActivities] = useState<Activity[]>([]);    

    const init = async () => {
        const activitiesArr = await fetchActivities();
        setActivities(activitiesArr as Activity[]);
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        
    }, [activities])

    return (
        <>
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left">External Title</th>
                    <th className="px-4 py-2 text-left">Params</th>
                </tr>
                </thead>
                <tbody>
                {
                activities.map((activity) => (
                    <tr key={activity.id} className="border-t">
                        <td className="px-4 py-2">
                            <p className="w-full border rounded px-2 py-1">{activity.external_title || ''}</p>
                        </td>
                        <td className="px-4 py-2">
                            <p className="w-full border rounded px-2 py-1">{JSON.stringify(activity.params) || ''}</p>
                        </td>
                        <td className="px-4 py-2">
                            <Button className="green-shadcn-button" onClick={()=>props.setSelectedFunc(activity)}>Select</Button>
                        </td>
                    </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
        </>
    );
}
