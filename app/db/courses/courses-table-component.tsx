"use client"
import { useEffect, useState } from 'react'
import { supabasePublicMain } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { checkUser } from '../general/get-user' // TODO: move check user up a level

export default function CoursesTable(){
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string>();
    const [editForm, setEditForm] = useState<Partial<Course>>({});
    const [user, setUser] = useState<User | null>(null);

    const addCourse = async () => {
        const { data, error } = await supabasePublicMain.from('courses').insert([
            {
                external_title: 'New Course',
                internal_title: 'New Course',
                description: 'About this course...',
                icon: '',                
            }
        ]).select();
        if (error) {
            console.error('Error adding course:', error);
        } else {
            setCourses([...courses, ...data as unknown as Course[]]);
        }
    }

    const handleEditClick = (course: Course) => {
        setEditingId(course.id)
        setEditForm(course)
      }
    
      const handleCancel = () => {
        setEditingId("")
        setEditForm({})
      }
    
      const handleChange = (field: keyof Course, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }))
      }
    
      const handleSave = async () => {
        if (!editingId) return
        const { error } = await supabasePublicMain
          .from('courses')
          .update(editForm)
          .eq('id', editingId)
    
        if (error) {
          console.error('Error updating Course:', error)
        } else {
          setCourses((prev) =>
            prev.map((c) => (c.id === editingId ? { ...c, ...editForm } : c))
          )
          setEditingId("")
          setEditForm({})
          }
        }

    useEffect(() => {
        const init = async () => {
            const user = await checkUser();
            if (user) { setUser(user); }
            setLoading(false);
        };
        init();

        const fetchCourses = async () => {
            setLoading(true);
            const { data, error } = await supabasePublicMain.from('courses').select('*');

            if (error) {
                console.error('Error fetching courses:', error);
            } else {
                setCourses(data);
            }
            setLoading(false);
        }
        fetchCourses();
    }, []);
    
    if(!user){ return <p>Not logged in</p> }
    if(user && loading){ return <p className="p-4">Loading modules...</p> }    

    if(user && !loading) return (        
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Courses</h1>
            <br/>
            <button className='button' onClick={addCourse}>Add Course</button>
            <br/>
            <br/>  
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Internal Title</th>
                    <th className="px-4 py-2 text-left">External Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Icon</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t">
                      {editingId === course.id ? (
                        <>
                          <td className="px-4 py-2">
                            <input
                              className="w-full border rounded px-2 py-1"
                              value={editForm.internal_title || ''}
                              onChange={(e) =>
                                handleChange('internal_title', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="w-full border rounded px-2 py-1"
                              value={editForm.external_title || ''}
                              onChange={(e) =>
                                handleChange('external_title', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              className="w-full border rounded px-2 py-1"
                              value={editForm.description || ''}
                              onChange={(e) =>
                                handleChange('description', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              className="w-full border rounded px-2 py-1"
                              value={editForm.icon || ''}
                              onChange={(e) =>
                                handleChange('icon', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              className="button"
                              onClick={handleSave}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">{course.internal_title}</td>
                          <td className="px-4 py-2">{course.external_title}</td>
                          <td className="px-4 py-2">
                            {course.description}
                          </td>
                          <td className="px-4 py-2">
                            {course.icon}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() => course.id !== undefined 
                                            && handleEditClick(course as Course)
                                }
                            >
                              ✏️
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
}