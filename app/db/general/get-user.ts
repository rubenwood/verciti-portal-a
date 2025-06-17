import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export async function checkUser(){
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return user;
}