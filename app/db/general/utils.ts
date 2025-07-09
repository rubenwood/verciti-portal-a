import { supabase } from '@/lib/supabase'


export async function fetchStages() {
    const { data, error } = await supabase.from('stages').select('*');

    if (error) {
        console.error('Error fetching activities:', error);
        return error;
    }

    return data as Stage[];
}

export async function fetchActivities() {
    const { data, error } = await supabase.from('activities').select('*');

    if (error) {
        console.error('Error fetching activities:', error);
        return error;
    }

    return data as Activity[];
}
export async function updateActivity(activity: Activity){
    const { data, error } = await supabase
      .from('activities')
      .update(activity)
      .eq('id', activity.id)
      .select();

      const output = {data: data, error: error};

      return output;
}


export async function fetchCourses() {
    const { data, error } = await supabase.from('courses').select('*');

    if (error) {
        console.error('Error fetching courses:', error);
        return error;
    }

    return data as Course[];
}