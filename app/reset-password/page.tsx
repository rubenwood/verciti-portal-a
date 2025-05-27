"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          router.push("/update-password");
        } else if (event === "SIGNED_IN" && session) {
          // fallback in case Supabase treats recovery as signed in
          router.push("/update-password");
        } else {
          setError("Could not retrieve session. Please use the link from your email.");
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <p>Processing password reset...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return null;
}
