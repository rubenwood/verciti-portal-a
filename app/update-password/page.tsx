"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("Error updating password.");
    } else {
      setStatus("Password updated!");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Reset your password</h2>
      <input
        type="password"
        className="border px-4 py-2 mb-2 w-full"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="button w-full" onClick={updatePassword}>
        Update Password
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
