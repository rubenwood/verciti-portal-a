"use client"
import { useEffect, useState } from 'react'
import { supabasePublicMain } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { checkUser } from '../general/get-user' // TODO: move check user up a level
import CAJJoiner from './caj-joiner-component'


// TODO: seperate tables per course

export default function CourseActivityJoinTable(){
    const [courses, setCourses] = useState<Course[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [courseActivities, setCourseActivities] = useState<CourseActivityWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { setUser(user); }
            setLoading(false);
        };
        init();

        const fetchCAJs = async () => {
            setLoading(true);
            
            const { data, error } = await supabasePublicMain
                .from('courses_activities_join')
                .select(`
                    id,
                    course_id,
                    activity_id,
                    order,
                    course: course_id (
                        id,
                        external_title
                    ),
                    activity: activity_id (
                        id,
                        external_title
                    )
                `)
                .order('course_id', { ascending: true })
                .order('order', { ascending: true });

            if (error) {
                console.error('Error fetching course activities join:', error);
            } else if (data) {
                // Map course/activity arrays to single objects
                setCourseActivities(
                    data.map((courseActivity: any) => ({
                        ...courseActivity,
                        course: Array.isArray(courseActivity.course) ? courseActivity.course[0] : courseActivity.course,
                        activity: Array.isArray(courseActivity.activity) ? courseActivity.activity[0] : courseActivity.activity,
                    }))
                );
            }
            setLoading(false);
        };
        fetchCAJs();

        const fetchCourses = async () => {
            const { data, error } = await supabasePublicMain.from('courses').select('*');
            if(data){
                setCourses(
                    data.map((course: any) => ({
                        ...course
                    }))
                );
            }
        }
        const fetchActivities = async () => {
            const { data, error } = await supabasePublicMain.from('activities').select('*');
            if(data){
                setActivities(
                    data.map((activity: any) => ({
                        ...activity
                    }))
                );
            }
        }

        fetchCourses();
        fetchActivities();
    }, []);
    
    if(!user){ return <p>Not logged in</p> }
    if(user && loading){ return <p className="p-4">Loading course activity joins...</p> }    

    if(user && !loading) return (        
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Courses Activities</h1>
            <br/>
            <CAJJoiner courses={courses} activities={activities} />
            <br/>  
          {courseActivities.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {/* <th className="px-4 py-2 text-left">Course Id</th> */}
                    <th className="px-4 py-2 text-left">Course Title</th>
                    {/* <th className="px-4 py-2 text-left">Activity Id</th> */}
                    <th className="px-4 py-2 text-left">Activity Title</th>
                    <th className="px-4 py-2 text-left">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {courseActivities.map((courseActivity) => (
                    <tr key={courseActivity.id} className="border-t">
                        {/* <td className="px-4 py-2">{courseActivity.course_id}</td> */}
                        <td className="px-4 py-2"><b>{courseActivity.course.external_title}</b></td>
                        {/* <td className="px-4 py-2">{courseActivity.activity_id}</td> */}
                        <td className="px-4 py-2">{courseActivity.activity.external_title}</td>
                        <td className="px-4 py-2">{courseActivity.order}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
}