import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';

export function getUsersLoggedInTimePeriod(userProgressData: any[], startDate: Date, endDate: Date) {

    console.log("Filtering logins between:", startDate, "and", endDate);

    const filteredUsersProgress = userProgressData.filter(user => {
        const prevLogins = user.previous_logins || [];
        return prevLogins.some((login: string) => {
            const loginDate = new Date(login);
            console.log("Checking login date:", loginDate);
            console.log("Is within range:", loginDate >= startDate && loginDate <= endDate);
            return loginDate >= startDate && loginDate <= endDate;
        });
    });

    console.log("Filtered users progress:", filteredUsersProgress);

    return filteredUsersProgress;
}