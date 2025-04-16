"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type Activity = {
    id: number
    created_at: string
    external_title: string
    internal_title: string
    time_est: string
    time_est_num: string
    icon_url: string
    title_asset_url: string
    about_text: string
    learning_objectives: string
    params: object
}

export default function ActivitiesTable(){
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Activity>>({});
    const [user, setUser] = useState<User | null>(null);

    const addActivity = async () => {
        const { data, error } = await supabase.from('activities').insert([
            {
                external_title: 'New Activity',
                internal_title: 'New Activity',
                time_est: '~1 min',
                time_est_num: 60,
                icon_url: '',
                title_asset_url: '',
                about_text: 'About this activity...',
                learning_objectives: 'Learning objectives...',
                params: {}
            }
        ]).select();
        if (error) {
            console.error('Error adding activity:', error);
        } else {
            setActivities([...activities, ...data as unknown as Activity[]]);
        }
    }

    const handleEditClick = (activity: Activity) => {
        setEditingId(activity.id)
        setEditForm(activity)
      }
    
      const handleCancel = () => {
        setEditingId(null)
        setEditForm({})
      }
    
      const handleChange = (field: keyof Activity, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }))
      }
    
      const handleSave = async () => {
        if (!editingId) return
        const { error } = await supabase
          .from('activities')
          .update(editForm)
          .eq('id', editingId)
    
        if (error) {
          console.error('Error updating activity:', error)
        } else {
          setActivities((prev) =>
            prev.map((a) => (a.id === editingId ? { ...a, ...editForm } : a))
          )
          setEditingId(null)
          setEditForm({})
        }
      }

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUser(user);
            }
            setLoading(false);
        };

        checkUser();

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
    
    if(!user){ return <p>Not logged in</p> }
    if(user && loading){ return <p className="p-4">Loading modules...</p> }    

    if(user && !loading) return (        
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Activities</h1>
            <br/>
            <button className='button' onClick={addActivity}>Add Activity</button>
            <br/>
            <br/>  
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
                    <th className="px-4 py-2 text-left">Time Estimate (Sec)</th>
                    <th className="px-4 py-2 text-left">About</th>
                    <th className="px-4 py-2 text-left">Learning Objectives</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-t">
                      {editingId === activity.id ? (
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
                            <input
                              className="w-full border rounded px-2 py-1"
                              value={editForm.time_est || ''}
                              onChange={(e) =>
                                handleChange('time_est', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="w-full border rounded px-2 py-1"
                              value={editForm.time_est_num || ''}
                              onChange={(e) =>
                                handleChange('time_est_num', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              className="w-full border rounded px-2 py-1"
                              value={editForm.about_text || ''}
                              onChange={(e) =>
                                handleChange('about_text', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              className="w-full border rounded px-2 py-1"
                              value={editForm.learning_objectives || ''}
                              onChange={(e) =>
                                handleChange('learning_objectives', e.target.value)
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
                          <td className="px-4 py-2">{activity.internal_title}</td>
                          <td className="px-4 py-2">{activity.external_title}</td>
                          <td className="px-4 py-2">{activity.time_est}</td>
                          <td className="px-4 py-2">{activity.time_est_num}</td>
                          <td className="px-4 py-2">
                            {activity.about_text}
                          </td>
                          <td className="px-4 py-2">
                            {activity.learning_objectives}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() => activity.id !== undefined 
                                            && handleEditClick(activity as Activity)
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