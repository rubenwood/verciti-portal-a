"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseMain, supabaseTest } from "@/lib/supabase";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hashParams.get('access_token');

    let env = 'test';
    let clientToUse = supabaseTest;

    if (accessToken) {
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      env = decoded?.iss.includes(process.env.NEXT_PUBLIC_SUPABASE_TEST_URL) ? 'test' : 'main';
      if (env === 'main') {
        clientToUse = supabaseMain;
      }else{
        clientToUse = supabaseTest;
      }
    }

    console.log("Using environment:", env);

    const { data: listener } = clientToUse.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        console.log("Session data:", session);
        if (event === "PASSWORD_RECOVERY") {
          router.replace(`/update-password?env=${env}`);
        }

        if (!session) {
          setError("Could not recover session. Please use the link from your email.");
          setLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <p>Processing password reset...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return null;
}
