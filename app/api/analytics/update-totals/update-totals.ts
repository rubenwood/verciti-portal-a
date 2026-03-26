import { NextResponse } from 'next/server';
import { 
    getUsersProfilesByVisibility,
    getUsersProfilesByOrgId,
    getUserAttempts,
    calcTotalUsageTime,
    calcTotalModulesCompleted 
} from '@/app/db/user/user-prog-analytics';
import { calcAverageQuizScore } from '@/app/db/user/user-quiz-analytics';
import { getUsersQuizAttempts } from "@/app/db/user/user-quiz-analytics";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export async function updateTotals(client: SupabaseClient){
    const {data:orgs, error:orgIdsError} = await client.from(process.env.ORG_TABLE_NAME!).select('id,content_tags');

    if(orgIdsError){
        console.error(orgIdsError);
        return null;
    }

    const results = [];
    for(const org of orgs){
        const updateResp = await updateForOrg(client, org.id); 
        results.push(updateResp);
    }

    return results;
}

async function updateForOrg(client: SupabaseClient, orgId:string){
    const profileData = await getUsersProfilesByOrgId(client, orgId);
    const attempts = await getUserAttempts(client, profileData.map((user) => user.id), 0, 1000);
    for(let i = 0; i < attempts.pageCount-1; i++){
        const moreAttempts = await getUserAttempts(client, profileData.map((user) => user.id), i+1, 1000);
        attempts.data = attempts.data.concat(moreAttempts.data);
    }

    const quizData = await getUsersQuizAttempts(client, profileData.map((user) => user.id));
    for(let i = 0; i < quizData.pageCount-1; i++){
        const moreQuizData = await getUsersQuizAttempts(client, profileData.map((user) => user.id), i+1, 1000);
        quizData.data = quizData.data.concat(moreQuizData.data);
    }

    const output = {
        data:null,
        error:null,
        orgId:orgId.toLowerCase(),
        TotalUsers:profileData.length,
        TotalUsageTime:calcTotalUsageTime(profileData),
        ActivitiesCompleted:calcTotalModulesCompleted(profileData),
        QuizAttempts:quizData.data.length,
        AverageScore:calcAverageQuizScore(quizData.data)
    }

    const { error } = await client.from(process.env.ORG_DATA_TABLE_NAME!).upsert({
        id:orgId.toLowerCase(),
        total_users:output.TotalUsers,
        total_usage_time:output.TotalUsageTime,
        activities_completed:output.ActivitiesCompleted,
        quiz_attempts:output.QuizAttempts,
        average_score:output.AverageScore,
        badges_earned:0
    });

    if(error)
    {
        console.error(error);
        return error;
    }

    return output;
}