//import { supabaseTest, supabaseMain } from '@/lib/supabase'
import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';
import crypto from "crypto";


export async function getUserProfile(client: SupabaseClient, user: User) {
    const { data, error } = await client
        .from('user_profiles')
        .select(`*, 
            org_access (
                content_tags
            )
        `)
        .eq('id', user.id);

    if (error) {
        console.error('Error fetching info texts:', error);
        throw error;
    }

    return data[0];
}


// gets all the table names in a given schema (and client)
export async function fetchTablesInSchema(client: SupabaseClient, schema: string) {
    if(!schema) return;

    const { data, error } = await client.rpc('list_tables', { schema_name: schema.toLowerCase() });

    if (error) {
        console.error('Error fetching tables:', error);
        return;
    }

    if (!data) {
        console.log('No tables returned');
        return;
    }

    return data.map((t: any, i: number) => ({ id: i, name: t.table_name }));
}
// downloads the specified tables as CSV files
export async function fetchTablesAsCSV(client: SupabaseClient, tables: string[]) {
    if (!tables || tables.length === 0) return [];

    const results: { table: string; blob: Blob }[] = [];

    for (const table of tables) {
        const { data, error } = await client
            .from(table)
            .select('*')
            .csv();

        if (error) {
            console.error(`Error fetching data from table "${table}":`, error);
            continue; // skip this table but continue processing others
        }

        if (data) {
            const blob = new Blob([data], {
                type: 'text/csv;charset=utf-8;',
            });

            results.push({ table, blob });
        }
    }

    return results;
}


// updates the media_en_uk field to be a filepath from the s3 upload,
// matching on batch_id and sheet_id extracted from the video file title
export async function updateMediaPaths(client: SupabaseClient, uploaded: { title: string; key: string }[]) {
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

        const { error } = await client
            .from('info_texts')
            .update({ media_en_uk: synthesiaPath })
            .eq('batch_id', batchId)
            .eq('sheet_id', sheetId);

        if (error) {
            console.error(`Failed to update media_en_uk for batch_id=${batchId}, sheet_id=${sheetId}:`, error.message);
        } else {
            console.log(`Updated media_en_uk for batch_id=${batchId}, sheet_id=${sheetId}: ${key}`);
        }
    }
}

export async function getInfoTextsByBatchId(client: SupabaseClient, batchId: string) {
    const { data, error } = await client
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
export async function deleteByBatchId(client: SupabaseClient, batchId: string, tableName: string) {
    const { data, error } = await client
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

export async function fetchQuizStagesByBatchId(client: SupabaseClient, batchId: string): Promise<StageWithQuestions[] | PostgrestError> {
    const { data: stages, error: stagesError } = await client
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

    const { data: questions, error: questionsError } = await client
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
export async function fetchAllInfoText(client: SupabaseClient) {
    const { data, error } = await client.from('info_texts').select('*');

    if (error) {
        console.error('Error fetching info texts:', error);
        return error;
    }

    return data as InfoText[];
}
export async function fetchInfoTextByBatchId(client: SupabaseClient, batchId: string) {
    const { data, error } = await client.from('info_texts').select('*').eq('batch_id', batchId);

    if (error) {
        console.error('Error fetching info text (by id):', error);
        return error;
    }

    return data as InfoText[];
}
export async function fetchInfoTextById(client: SupabaseClient, infoTextId: string) {
    const { data, error } = await client.from('info_texts').select('*').eq('id', infoTextId).single();

    if (error) {
        console.error('Error fetching info text (by id):', error);
        return error;
    }

    return data as InfoText;
}
// TODO: test & use this to update patch-batches
export async function updateInfoText(client: SupabaseClient, infoText: { id: string; text_en_uk: { title: string; body: string }; media_en_uk?: string;}) {
    const { data, error } = await client
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
export async function updateInfoTextFull(client: SupabaseClient, infoText: InfoText) {
    const { data, error } = await client
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
export async function insertInfoTexts(client: SupabaseClient, rows: { heading: string; body: string; sheetId: number}[], batchId: string) {
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

    const { data, error } = await client.from('info_texts').insert(insertData).select();

    if (error) {
        console.error('Insert info text error:', error);
        throw error;
    }

    return data;
}
//
export async function insertStages(client: SupabaseClient, rows: { stageType: string, stageAssets: object, stageParams: Record<string, any>, stageBatchId: string }[]) {
    const insertData = rows.map( r => ({
        type: r.stageType,
        assets: r.stageAssets,
        params: r.stageParams,
        batch_id: r.stageBatchId
    }));

    const { data, error } = await client.from('stages').insert(insertData).select();

    if (error) {
        console.error('Insert stage error:', error);
        throw error;
    }

    return data; // Contains id and created_at from Supabase
}
export async function updateStage(client: SupabaseClient, stage: Stage) {
    const { data, error } = await client
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
export async function fetchStagesWithInfoTextsByBatchId(client: SupabaseClient, batchId: string): Promise<StageWithInfoText[] | PostgrestError> {
   const { data: stages, error: stagesError } = await client
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

    const { data: infoTexts, error: infoTextError } = await client
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
export async function fetchStagesWithInfoTexts(client: SupabaseClient, stageIds: string[]): Promise<StageWithInfoText[] | PostgrestError> {
   const { data: stages, error: stagesError } = await client
        .from('stages')
        .select('*')
        .in('id', stageIds);

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

    const { data: infoTexts, error: infoTextError } = await client
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
export async function fetchStagesByIds(client: SupabaseClient, stageIds: string[]): Promise<Stage[] | PostgrestError> {
    const { data, error } = await client
        .from('stages')
        .select('*')
        .in('id', stageIds);
    if (error) {
        console.error('Error fetching stages by IDs:', error);
        return error;
    }
    return data as Stage[];
}
export async function fetchStages(client: SupabaseClient) {
    const { data, error } = await client.from('stages').select('*');

    if (error) {
        console.error('Error fetching stages:', error);
        return error;
    }

    return data as Stage[];
}
//
export async function insertActivity(client: SupabaseClient, activity: Activity){
    const { data, error } = await client.from('activities').insert(activity).select();
    const output = {data: data, error: error};
    return output;
} 
export async function fetchActivities(client: SupabaseClient) {
    const { data, error } = await client.from('activities').select('*');

    if (error) {
        console.error('Error fetching activities:', error);
        return error;
    }

    return data as Activity[];
}
export async function fetchActivitiesByVisibility(client: SupabaseClient, visibility: string[]) {
    const { data, error } = await client.from('activities')
    .select('*')
    .contains('visibility', [visibility]);

    if (error) {
        console.error('Error fetching activities by visibility:', error);
        return error;
    }

    return data as Activity[];
}
export async function fetchActivityById(client: SupabaseClient, activityId: string) {
    const { data, error } = await client.from('activities').select('*').eq('id', activityId).single();
    if (error) {
        console.error('Error fetching activity (by id):', error);
        return error;
    }
    return data as Activity;
}
export async function updateActivity(client: SupabaseClient, activity: Activity) {
    const { data, error } = await client
      .from('activities')
      .update(activity)
      .eq('id', activity.id)
      .select();

      const output = {data: data, error: error};

      return output;
}
//
export async function fetchCourses(client: SupabaseClient) {
    const { data, error } = await client.from('courses').select('*');

    if (error) {
        console.error('Error fetching courses:', error);
        return error;
    }

    return data as Course[];
}
export async function fetchCoursesByVisibility(client: SupabaseClient, visibility: string[]) {
    const { data, error } = await client.from('courses').select('*').contains('visibility', [visibility]);

    if (error) {
        console.error('Error fetching courses by visibility:', error);
        return error;
    }

    return data as Course[];
}
export function fetchCourseActivityByVisibility(client: SupabaseClient, visibility: string[]) {
    return client.from('courses_activities_join').select(`
            id,
            activity_id,
            course_id,
            "order",
            activity:activities!inner (*),
            course:courses (*)
        `)
        .overlaps('activities.visibility', visibility);
}

// copies data from a table in one Supabase client to another (assuming identical schemas and table names)
export async function copyDataBetweenTables(fromClient: SupabaseClient, toClient: SupabaseClient, tables: string[], updateCopyNum: boolean) {
    // TODO: make sure we copy data before joins

    for (const table of tables) {
        const { data, error } = await fromClient
            .from(table)
            .select('*');

        if (error) {
            console.error(`Error fetching data from table "${table}":`, error);
            continue;
        }
        if (data && data.length > 0) {
            const { error: insertError } = await toClient
                .from(table)
                .upsert(data);

            if (insertError) {
                console.error(`Error inserting data into table "${table}":`, insertError);
                continue;
            }

            console.log(`Successfully copied ${data.length} records to table "${table}"`);

            // once we have copied data, we should update the db_change_num in the versions tables
            // assuming test
            if(updateCopyNum){
                await updateVersionsTable(fromClient, "versions_android");
                await updateVersionsTable(fromClient, "versions_ios");
            }
        }
    }
}

async function getLatestDBChangeNum(client: SupabaseClient, versionTable: string) {
    const { data, error } = await client
        .from(versionTable)
        .select('db_copy_num')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error(`Error fetching latest db_change_num from table "${versionTable}":`, error);
        return null;
    }

    return data.db_copy_num;
}

async function updateVersionsTable(client: SupabaseClient, versionTable: string) {
    const latestDBChangeNum = await getLatestDBChangeNum(client, versionTable);
    const newChangeNum = latestDBChangeNum+1;
    console.log(`${latestDBChangeNum} - ${newChangeNum}`);

    const { data, error } = await client
        .from(versionTable)
        .update({ db_copy_num: newChangeNum })
        .gt('id', -1)

    if(error){
        console.error(`Error updating db change num: \n`, error);
    }
}



export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "0s";
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
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

export function formatDate(
  iso: any,
  options?: { includeTime?: boolean }
) {
  const d = new Date(iso);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let result = `${day}/${month}/${year}`;

  if (options?.includeTime) {
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    result += ` ${hours}:${minutes}`;
  }

  return result;
}


export function getUserFolder(userId: string) {
  return crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex");
}