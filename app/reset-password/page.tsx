"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseMain } from "@/lib/supabase";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabaseMain.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          router.replace("/update-password");
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
