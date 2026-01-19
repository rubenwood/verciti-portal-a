import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';

export async function getUsersQuizAttempts(client: SupabaseClient, user_ids: string[]){
    const { data, error } = await client
        .from('quiz_attempts')
        .select('*')
        .in('user_id', user_ids);

    if (error) {
        console.error("Error fetching user quiz attempts:", error);
        return [];
    }

    return data as any[];
}


//
export function calcTotalQuizStages(quizAttemptsData: any[]){
    const uniqueQuizStages = new Set<string>();

    quizAttemptsData.forEach(attempt => {
        if(attempt.stage_id){
            uniqueQuizStages.add(attempt.stage_id);
        }
    });

    return uniqueQuizStages.size;
}

export function calcCompletedQuizzes(quizAttemptsData: any[]){
    const completedQuizAttempts: any[] = [];

    for(const attempt of quizAttemptsData) {
        if(attempt.completed_on == null || attempt.completed_on == "" ){
            continue;
        }

        const completedDate = new Date(attempt.completed_on);
        const zeroDate = new Date("0001-01-01T00:00:00Z");
        if(!isNaN(completedDate.getTime()) && completedDate.getTime() !== zeroDate.getTime()){
            console.log(attempt.completed_on);
            completedQuizAttempts.push(attempt);
        }
    }
    console.log("Completed Quiz Attempts:", completedQuizAttempts);
    return completedQuizAttempts;
}

export function calcTotalQuizDuration(quizAttemptsData: any[]){
    let totalDuration = 0;
    quizAttemptsData.forEach(attempt => {
        if(attempt.duration && typeof attempt.duration === 'number'){
            totalDuration += attempt.duration;
        }
    });
    return totalDuration;
}

export function calcAverageQuizScore(quizAttemptsData: any[]){
    let totalScore = 0;
    let count = 0;
    quizAttemptsData.forEach(attempt => {
        if(attempt.score && typeof attempt.score === 'number'){
            totalScore += attempt.score;
            count++;
        }
    });
    return count > 0 ? totalScore / count : 0;
}