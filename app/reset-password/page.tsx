"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get('type');

    if (type === 'recovery') {
      supabase.auth
        .setSession({
          access_token: params.get('access_token')!,
          refresh_token: params.get('refresh_token')!,
        })
        .then(() => setLoading(false));
    } else {
      router.push('/');
    }
  }, [router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Password updated! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid place-items-center min-h-screen p-6">
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <h1 className="text-xl font-bold">Reset Your Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Password
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
