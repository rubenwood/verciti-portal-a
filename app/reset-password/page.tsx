"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    console.log("URL hash:", hash);

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_TEST_ANON_KEY!,
    )

    const { data: listener } = client.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        console.log("Session data:", session);
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
