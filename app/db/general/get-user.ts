import { supabaseMain, supabaseTest } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export async function checkUser(){
    const { data: { user }, error } = await supabaseMain.auth.getUser();
    const { data: { user: testUser }, error: testError } = await supabaseTest.auth.getUser();

    if(testError){
        console.error('Error fetching test user:', testError);
    }

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return user;
}