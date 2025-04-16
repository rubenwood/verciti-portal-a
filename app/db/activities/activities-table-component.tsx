"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Activity = {
    id: number
    created_at: string
    external_title: string
    internal_title: string
    time_est: string
    time_est_num: string
    icon_path: string
    title_asset_path: string
    about_text: string
    learning_objectives: string
    params: string
}

export default function ActivitiesTable(){
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('activities').select('*');

            if (error) {
                console.error('Error fetching activities:', error);
            } else {
                setActivities(data as Activity[]);
            }
            setLoading(false);
        }
        fetchActivities();
    }, []);

    if (loading) return <p className="p-4">Loading modules...</p>

    return (
        <>
            <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Activities</h1>
            {activities.length === 0 ? (
                <p>No activities found.</p>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Internal Title</th>
                        <th className="px-4 py-2 text-left">External Title</th>
                        <th className="px-4 py-2 text-left">Time Estimate</th>
                        <th className="px-4 py-2 text-left">About</th>
                        <th className="px-4 py-2 text-left">Learning Objectives</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activities.map((activity) => (
                        <tr key={activity.id} className="border-t">
                        <td className="px-4 py-2">{activity.internal_title}</td>
                        <td className="px-4 py-2">{activity.external_title}</td>
                        <td className="px-4 py-2">{activity.time_est}</td>
                        <td className="px-4 py-2">{activity.about_text?.slice(0, 80)}...</td>
                        <td className="px-4 py-2">{activity.learning_objectives?.slice(0, 80)}...</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>   
        </>
    )
}