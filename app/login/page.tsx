'use client'
import { useEffect } from 'react';
import { supabaseMain, supabaseTest } from '@/lib/supabase'

import Login from './login-component';

export default function LoginPage(){
    useEffect(() => {
        // TODO: change this
        supabaseMain.auth.signOut();
        supabaseTest.auth.signOut();
    });

    return(
        <>
            <Login path='/lms' />
        </>
    )
}