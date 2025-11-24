"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, supabaseTest } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js';

export default function Login(props: any){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        await doLogin(supabase);
        await doLogin(supabaseTest);
    };

    const doLogin = async (client: SupabaseClient) => {
        const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            console.error('Login error:', client, "\n", error.message);
        } else {
            console.log('Login successful:', client);
            if(props.setTestUserFunc){ props.setTestUserFunc(data.user); }
            if(props.path){ router.push(props.path); }
        }
    };


    const handleLoginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://vertciti-portal.vercel.app/google-login'
            }
        });
        if(error){
            setError(error.message);
            console.error('Google Login error:', error.message);
        } else {
            console.log('Google Login initiated:', data);
        }
    }

    return(
        <>
        <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
            <div>
                <h1 className='header'>Login</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border p-2 mb-2 w-full"
                />
                <button className="button" onClick={handleLogin}>
                    Login
                </button>
                <br />
                <button className="button mt-2" onClick={handleLoginWithGoogle}>
                    Login with Google
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
        </>
    )
}