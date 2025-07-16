"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'

export default function Login(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // TODO: change this
        supabase.auth.signOut();
    });

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            console.error('Login error:', error.message);
        } else {
            console.log('Login successful:', data);
            router.push('/lms');
        }
    };

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
            </div>
        </div>
        </>
    )
}