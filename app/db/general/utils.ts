import { supabase } from '@/lib/supabase'
import { createClient, PostgrestError } from '@supabase/supabase-js';
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

        let synthesiaPath = key;
        if (synthesiaPath.startsWith("dev/"))
        { // TODO: test this
            synthesiaPath = synthesiaPath.replace(/^\/?dev\//, '');
        }

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
// Delete by batch id from any table
export async function deleteByBatchId(batchId: string, tableName: string) {
    const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('batch_id', batchId)
        .select();

    if (error) {
        console.error('Error deleting info texts:', error);
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
//
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
export async function updateInfoTextFull(infoText: InfoText) {
    const { data, error } = await supabase
    .from('info_texts')
    .update(infoText)
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
//
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
export async function updateStage(stage: Stage) {
    const { data, error } = await supabase
    .from('stages')
    .update(stage)
    .eq('id', stage.id)
    .select();
    if (error) {
        console.error('Error updating stage:', error);
        throw error;
    }
    return data;
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

    // sort the stages by the info text's sheet_id
    results.sort((a, b) => {
        const sheetA = a.related_info_text?.sheet_id ?? Number.MAX_SAFE_INTEGER;
        const sheetB = b.related_info_text?.sheet_id ?? Number.MAX_SAFE_INTEGER;
        return sheetA - sheetB;
    });
    return results;
}
export async function fetchStagesByIds(stageIds: string[]): Promise<Stage[] | PostgrestError> {
    const { data, error } = await supabase
        .from('stages')
        .select('*')
        .in('id', stageIds);
    if (error) {
        console.error('Error fetching stages by IDs:', error);
        return error;
    }
    return data as Stage[];
}
export async function fetchStages() {
    const { data, error } = await supabase.from('stages').select('*');

    if (error) {
        console.error('Error fetching stages:', error);
        return error;
    }

    return data as Stage[];
}
//
export async function insertActivity(activity: Activity){
    const { data, error } = await supabase.from('activities').insert(activity).select();
    const output = {data: data, error: error};
    return output;
} 
export async function fetchActivities() {
    const { data, error } = await supabase.from('activities').select('*');

    if (error) {
        console.error('Error fetching activities:', error);
        return error;
    }

    return data as Activity[];
}
export async function fetchActivityById(activityId: string) {
    const { data, error } = await supabase.from('activities').select('*').eq('id', activityId).single();
    if (error) {
        console.error('Error fetching activity (by id):', error);
        return error;
    }
    return data as Activity;
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
//
export async function fetchCourses() {
    const { data, error } = await supabase.from('courses').select('*');

    if (error) {
        console.error('Error fetching courses:', error);
        return error;
    }

    return data as Course[];
}
//
export async function copyDataBetweenTables(
    rowCount: number,
    randomize: boolean,
    fromSchema: string, 
    toSchema: string,
    fromTable: string, 
    toTable: string) {

    const fromClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { db: { schema: fromSchema } })
    const toClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { db: { schema: toSchema } })

    const { data: rows, error: selectError } = await fromClient
    .from(fromTable)
    .select('*')
    .limit(rowCount);

    if (selectError) {
        console.error('Error fetching rows:', selectError);
        throw selectError;
    }

    if (!rows || rows.length === 0) {
        console.warn('No rows found to copy.');
        return;
    }

    const { error: insertError } = await toClient
    .from(toTable)
    .upsert(rows);

    if (insertError) {
        console.error('Error inserting rows:', insertError);
        throw insertError;
    }

    console.log(`Copied ${rows.length} rows from ${fromSchema}.${fromTable} → ${toSchema}.${toTable}`);
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