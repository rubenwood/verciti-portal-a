import { supabase } from '@/lib/supabase'
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';

export async function updateMediaPaths(uploaded: { title: string; key: string }[]) {
    for (const { title, key } of uploaded) {
        const match = key.match(/_info_([0-9a-f-]{36})_/i);
        const infoTextId = match ? match[1] : null;

        if (!infoTextId) {
            console.warn(`Could not extract infoTextId from key: ${key}`);
            continue;
        }

        const { error } = await supabase
        .from('info_texts')
        .update({ media_en_uk: key })
        .eq('id', infoTextId);

        if (error) {
            console.error(`Failed to update media_en_uk for ID ${infoTextId}:`, error.message);
        } else {
            console.log(`Updated media_en_uk for ID ${infoTextId}: ${key}`);
        }
    }
}

export async function getInfoTextsByBatchId(batchId: string) {
    const { data, error } = await supabase
        .from('info_texts')
        .select('*')
        .eq('batch_id', batchId);

    if (error) {
        console.error('Error fetching info texts:', error);
        throw error;
    }

    return data;
}

export async function deleteInfoTextByBatchId(batchId: string) {
    const { data, error } = await supabase
        .from('info_texts')
        .delete()
        .eq('batch_id', batchId)
        .select();

    if (error) {
        console.error('Error deleting info texts:', error);
        throw error;
    }

    return data;
}

export async function insertInfoTexts(rows: { heading: string; body: string;}[], bathcId: string) {
    const validRows = rows.filter(r => r.body.trim().length > 0);

    const insertData = validRows.map(r => ({
        text_en_uk: { title: r.heading, body: r.body.trim() },
        text_en_us: null,
        text_fr: null,
        text_es: null,
        text_de: null,
        text_ar: null,
        media_en_uk: null,
        media_en_us: null,
        batch_id: bathcId
    }));

    const { data, error } = await supabase.from('info_texts').insert(insertData).select();

    if (error) {
        console.error('Insert info text error:', error);
        throw error;
    }

    return data;
}

export async function fetchAllInfoText() {
    const { data, error } = await supabase.from('info_texts').select('*');

    if (error) {
        console.error('Error fetching info texts:', error);
        return error;
    }

    return data as InfoText[];
}
export async function fetchInfoText(infoTextId: string) {
    const { data, error } = await supabase.from('info_texts').select('*').eq('id', infoTextId).single();

    if (error) {
        console.error('Error fetching info text (by id):', error);
        return error;
    }

    return data as InfoText[];
}


export async function deleteStageByBatchId(batchId: string) {
    const { data, error } = await supabase
        .from('stages')
        .delete()
        .eq('batch_id', batchId)
        .select();

    if (error) {
        console.error('Error deleting info texts:', error);
        throw error;
    }

    return data;
}

export async function insertStages(rows: { stageType: string, stageAssets: object, stageParams: Record<string, any>, stageBatchId: string }[]) {
    const insertData = rows.map( r => ({
        type: r.stageType,
        assets: r.stageAssets,
        params: r.stageParams,
        batch_id: r.stageBatchId
    }));

    const { data, error } = await supabase.from('stages').insert(insertData).select();

    if (error) {
        console.error('Insert stage error:', error);
        throw error;
    }

    return data; // Contains id and created_at from Supabase
}

export async function fetchStages() {
    const { data, error } = await supabase.from('stages').select('*');

    if (error) {
        console.error('Error fetching stages:', error);
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