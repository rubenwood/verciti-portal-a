import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';


// updates the media_en_uk field to be a filepath from the s3 upload,
// matching on batch_id and sheet_id extracted from the video file title
export async function updateMediaPaths(uploaded: { title: string; key: string }[]) {
    for (const { title, key } of uploaded) {
        // Extract batch_id and sheet_id from the title
        const match = title.match(/^([^_]+)_([^_]+)_info_[0-9a-f-]{36}_/i);
        if (!match) {
            console.warn(`Could not extract batch_id and sheet_id from title: ${title}`);
            continue;
        }

        const batchId = match[1];
        const sheetId = match[2];

        const { error } = await supabase
            .from('info_texts')
            .update({ media_en_uk: key })
            .eq('batch_id', batchId)
            .eq('sheet_id', sheetId);

        if (error) {
            console.error(`Failed to update media_en_uk for batch_id=${batchId}, sheet_id=${sheetId}:`, error.message);
        } else {
            console.log(`Updated media_en_uk for batch_id=${batchId}, sheet_id=${sheetId}: ${key}`);
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

// TODO: test & use this to update patch-batches
export async function updateInfoText(infoText: { id: string; text_en_uk: { title: string; body: string }; media_en_uk?: string;}) {
    const { data, error } = await supabase
    .from('info_texts')
    .update({
        text_en_uk: infoText.text_en_uk,
    })
    .eq('id', infoText.id)
    .select();

    if (error) {
        console.error('Error updating info text:', error);
        throw error;
    }

    return data;
}
export async function insertInfoTexts(rows: { heading: string; body: string; sheetId: number}[], batchId: string) {
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
        batch_id: batchId,
        sheet_id: r.sheetId
    }));

    const { data, error } = await supabase.from('info_texts').insert(insertData).select();

    if (error) {
        console.error('Insert info text error:', error);
        throw error;
    }

    return data;
}

export async function fetchQuizStagesByBatchId(batchId: string): Promise<StageWithQuestions[] | PostgrestError> {
    const { data: stages, error: stagesError } = await supabase
        .from('stages')
        .select('*')
        .eq('batch_id', batchId)
        .eq('type', 'quiz');

    if (stagesError) {
        console.error('Error fetching quiz stages:', stagesError);
        return stagesError;
    }

    const questionsIds = stages.map((stage) => {
        try {
            const params = typeof stage.params === 'string' ? JSON.parse(stage.params) : stage.params;
            return params?.questions || [];
        } catch {
            return null;
        }
    }).flat().filter((id): id is string => !!id);
    
    const uniqueQuestionIds = Array.from(new Set(questionsIds));

    const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .in('id', uniqueQuestionIds);

    if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return questionsError;
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const results: StageWithQuestions[] = stages.map((stage) => {
        let related_questions: QuizQuestion[] = [];
        try {
            const params = typeof stage.params === 'string' ? JSON.parse(stage.params) : stage.params;
            const questionIds = params?.questions || [];
            related_questions = questionIds.map((id: string) => questionMap.get(id)).filter((q: any): q is QuizQuestion => !!q);
        } catch {
            related_questions = [];
        }

        return {
            stage,
            related_questions,
        };
    });

    return results; 
}

export async function fetchAllInfoText() {
    const { data, error } = await supabase.from('info_texts').select('*');

    if (error) {
        console.error('Error fetching info texts:', error);
        return error;
    }

    return data as InfoText[];
}
export async function fetchInfoTextByBatchId(batchId: string) {
    const { data, error } = await supabase.from('info_texts').select('*').eq('batch_id', batchId);

    if (error) {
        console.error('Error fetching info text (by id):', error);
        return error;
    }

    return data as InfoText[];
}
export async function fetchInfoTextById(infoTextId: string) {
    const { data, error } = await supabase.from('info_texts').select('*').eq('id', infoTextId).single();

    if (error) {
        console.error('Error fetching info text (by id):', error);
        return error;
    }

    return data as InfoText;
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
export async function fetchStagesWithInfoTexts(batchId: string): Promise<StageWithInfoText[] | PostgrestError> {
   const { data: stages, error: stagesError } = await supabase
        .from('stages')
        .select('*')
        .eq('batch_id', batchId);

    if (stagesError) {
        console.error('Error fetching stages:', stagesError);
        return stagesError;
    }

    const infoTextIds = stages
        .map((stage) => {
            try {
                const params = typeof stage.params === 'string' ? JSON.parse(stage.params) : stage.params;
                return params?.infoTextId;
            } catch {
                return null;
            }
        })
        .filter((id): id is string => !!id);

    const uniqueInfoTextIds = Array.from(new Set(infoTextIds));

    const { data: infoTexts, error: infoTextError } = await supabase
        .from('info_texts')
        .select('*')
        .in('id', uniqueInfoTextIds);

    if (infoTextError) {
        console.error('Error fetching info texts:', infoTextError);
        return infoTextError;
    }

    const infoTextMap = new Map(infoTexts.map((txt) => [txt.id, txt]));

    const results: StageWithInfoText[] = stages.map((stage) => {
        let related_info_text: InfoText | null = null;

        try {
            const params = typeof stage.params === 'string' ? JSON.parse(stage.params) : stage.params;
            const infoTextId = params?.infoTextId;
            related_info_text = infoTextMap.get(infoTextId) || null;
        } catch {
            related_info_text = null;
        }

        return {
            stage,
            related_info_text,
        };
    });

    return results;
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



export function showConfetti<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null>){
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