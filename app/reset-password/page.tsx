"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseMain, supabaseTest } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const test = window.location.href;
    console.log("Current URL 2 :", test);
    const test2 = window.location.search;
    console.log("URL query parameters 2 :", test2);
    const hash = window.location.hash;
    console.log("URL hash 2 :", hash);
    //TODO: need to switch based off of the account
    // could be an account from test or main

    const { data: listener } = supabaseTest.auth.onAuthStateChange(
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
