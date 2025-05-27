"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleRecovery = async () => {
      // Wait for Supabase to handle the access_token from URL fragment
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setError("Could not retrieve session. Please use the link from your email.");
        setLoading(false);
        return;
      }

      // User is now signed in via recovery token — show reset form or redirect
      setLoading(false);
      router.push("/update-password"); // or show reset password form here
    };

    handleRecovery();
  }, [supabase, router]);

  if (loading) return <p>Processing password reset...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return null;
}

