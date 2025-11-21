"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'

export default function Login(props: any){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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
            if(props.setUserFunc){ props.setUserFunc(data.user); }
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