"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseMain, supabaseTest } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

export default function Login(props: any){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        await doLogin(supabaseMain);
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
            if(props.setTestUserFunc){ props.setTestUserFunc(data.user); }
            if(props.path){ router.push(props.path); }
        }
    };


    const handleLoginWithGoogle = async () => {
        const { data, error } = await supabaseMain.auth.signInWithOAuth({
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
                <Button className="green-shadcn-button" onClick={handleLogin}>
                    Login
                </Button>
                <br />
                <Button className="green-shadcn-button mt-2" onClick={handleLoginWithGoogle}>
                    Login with Google
                </Button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
        </>
    )
}