'use client'
import { useEffect } from 'react';
import { supabase, supabaseTest } from '@/lib/supabase'

import Login from './login-component';

export default function LoginPage(){
    useEffect(() => {
        // TODO: change this
        supabase.auth.signOut();
        supabaseTest.auth.signOut();
    });

    return(
        <>
            <Login path='/lms' />
        </>
    )
}