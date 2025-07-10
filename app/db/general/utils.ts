import { supabase } from '@/lib/supabase'
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';


export async function fetchAllInfoText() {
    const { data, error } = await supabase.from('info_texts').select('*');

    if (error) {
        console.error('Error fetching activities:', error);
        return error;
    }

    return data as InfoText[];
}
export async function fetchInfoText(infoTextId: string) {
    const { data, error } = await supabase.from('info_texts').select('*').eq('id', infoTextId).single();

    if (error) {
        console.error('Error fetching activities:', error);
        return error;
    }

    return data as InfoText[];
}

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


export function showConfetti<T extends HTMLElement = HTMLElement>(ref: RefObject<T>){
    if (!ref?.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
        particleCount: 70,
        spread: 50,
        origin: { x, y },
        startVelocity:30
    });
}