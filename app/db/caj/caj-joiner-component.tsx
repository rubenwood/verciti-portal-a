"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { checkUser } from '../general/get-user' // TODO: move check user up a level

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function CourseDropdown(props: {courses: Course[], setCourseFunc: any }) {
  return (
    <Select onValueChange={props.setCourseFunc}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a course" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Courses</SelectLabel>
          {props.courses.map((course) => (
            <SelectItem key={course.id} value={course.id.toString()}>
              {course.external_title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function ActivityDropdown(props: { activities: Activity[], setActivityFunc: any }) {
  return (
    <Select onValueChange={props.setActivityFunc}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an activity" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Activities</SelectLabel>
          {props.activities.map((activity) => (
            <SelectItem key={activity.id} value={activity.id.toString()}>
              {activity.external_title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default function CAJJoiner(props: any){
    const [courses, setCourses] = useState<Course[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [courseActivities, setCourseActivities] = useState<CourseActivityWithDetails[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course>();
    const [selectedActivity, setSelectedActivity] = useState<Activity>();

    const addCourseActivityJoin = async () => {
        const { data, error } = await supabase.from('courses_activities_join').insert([
            {
                course_id: selectedCourse,
                activity_id: selectedActivity,
                order: 0,              
            }
        ]).select();
        
        if (error) {
            console.error('Error adding course:', error);
        } else {
            setCourseActivities([...courseActivities, ...data as unknown as CourseActivityWithDetails[]]);
        }
    }

    useEffect(() => {
        setCourses(props.courses);
        setActivities(props.activities);
    }, [props]);

    return (
        <>
        <div>
            <CourseDropdown courses={courses} setCourseFunc={setSelectedCourse} />
            <ActivityDropdown activities={activities} setActivityFunc={setSelectedActivity} />
            <br/>
            <button className='button' onClick={addCourseActivityJoin}>Add Course Activity Join</button>
            <br/>
        </div>
        </>
    )
}