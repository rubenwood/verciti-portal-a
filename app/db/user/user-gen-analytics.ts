import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';

export function getUsersCreatedInTimePeriod(userProgressData: any[], startDate: Date, endDate: Date) {
    console.log("Filtering users created between:", startDate, "and", endDate);
    const filteredUsersProgress = userProgressData.filter(user => {
        const createdAt = new Date(user.created_at);
        console.log("Checking user created_at:", createdAt);
        console.log("Is within range:", createdAt >= startDate && createdAt <= endDate);
        return createdAt >= startDate && createdAt <= endDate;
    });

    console.log("users created in period:", filteredUsersProgress); 
    return filteredUsersProgress;
}

export function getUsersLoggedInTimePeriod(userProgressData: any[], startDate: Date, endDate: Date) {

    console.log("Filtering logins between:", startDate, "and", endDate);

    const filteredUsersProgress = userProgressData.filter(user => {
        const prevLogins = user.previous_logins || [];
        return prevLogins.some((login: string) => {
            const loginDate = new Date(login);
            //console.log("Checking login date:", loginDate);
            //console.log("Is within range:", loginDate >= startDate && loginDate <= endDate);
            return loginDate >= startDate && loginDate <= endDate;
        });
    });

    console.log("users logged in period:", filteredUsersProgress);

    return filteredUsersProgress;
}