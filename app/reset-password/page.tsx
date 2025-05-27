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
      const hash = window.location.hash;

      if (!hash.includes("access_token")) {
        setError("No access token found in URL.");
        setLoading(false);
        return;
      }

      // Extract the access_token from the hash
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        setError("Invalid or missing tokens in URL.");
        setLoading(false);
        return;
      }

      const { error: recoveryError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (recoveryError) {
        setError("Could not recover session. Please use the link from your email.");
        setLoading(false);
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !data.session) {
        setError("Session not found after recovery.");
        setLoading(false);
        return;
      }

      // Success — redirect to update-password
      router.push("/update-password");
    };

    handleRecovery();
  }, [router]);

  if (loading) return <p>Processing password reset...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return null;
}
