'use client'
import { useEffect } from 'react';
import { supabasePublicMain } from '@/lib/supabase'

import Login from './login-component';

export default function LoginPage(){
    useEffect(() => {
        // TODO: change this
        supabasePublicMain.auth.signOut();
    });

    return(
        <Login path='/lms' />
    )
}