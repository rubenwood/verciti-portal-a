import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';

export function getUsersCreatedInTimePeriod(userProgressData: any[], startDate: Date, endDate: Date) {
    const filteredUsersProgress = userProgressData.filter(user => {
        const createdAt = new Date(user.created_at);
        return createdAt >= startDate && createdAt <= endDate;
    });

    //console.log("users created in period:", filteredUsersProgress); 
    return filteredUsersProgress;
}

export function getUsersLoggedInTimePeriod(userProgressData: any[], startDate: Date, endDate: Date) {
    const filteredUsersProgress = userProgressData.filter(user => {
        const prevLogins = user.previous_logins || [];
        return prevLogins.some((login: string) => {
            const loginDate = new Date(login);
            return loginDate >= startDate && loginDate <= endDate;
        });
    });

    //console.log("users logged in period:", filteredUsersProgress);

    return filteredUsersProgress;
}