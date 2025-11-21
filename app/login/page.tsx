'use client'
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase'

import Login from './login-component';

export default function LoginPage(){
    useEffect(() => {
        // TODO: change this
        supabase.auth.signOut();
    });

    return(
        <Login path='/lms' />
    )
}