"use client"
import { useEffect, useState } from 'react'
import { supabasePublicMain } from '@/lib/supabase'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

// TODO: show warning if that activity already exists in the course
// TODO: make it so you can drag entries to reorder them

export function CourseOrActivityDropdown(props: {text:string, dataArray: any[], setSelectedFunc: any }) {
  return (
    <Select onValueChange={props.setSelectedFunc}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select ${props.text}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{props.text}</SelectLabel>
          {props.dataArray.map((element) => (
            <SelectItem key={element.id} value={element.id.toString()}>
              {element.external_title}
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
        const { data, error } = await supabasePublicMain.from('courses_activities_join').insert([
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
        <div className='flex flex-row space-x-[10px]'>
            <CourseOrActivityDropdown text={"Course"} dataArray={courses} setSelectedFunc={setSelectedCourse} />
            <CourseOrActivityDropdown text={"Activity"} dataArray={activities} setSelectedFunc={setSelectedActivity} />
            <br/>
            <Button className="green-shadcn-button" onClick={addCourseActivityJoin}>Add Course Activity Join</Button>
            <br/>
        </div>
        </>
    )
}