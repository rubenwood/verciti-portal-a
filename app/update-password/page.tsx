"use client";
import { useState } from "react";
import { supabasePublicMain } from "@/lib/supabase";
import Image from 'next/image'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const updatePassword = async () => {
    const { error } = await supabasePublicMain.auth.updateUser({ password });

    if (error) {
      setStatus("Error updating password.");
    } else {
      setStatus("Password updated!");
    }
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen pb-80 bg-[#121212]">
        <Image src="/Bright_Green_No_Tagline_1024x224.png" alt="Verciti Logo" width={512} height={112}/>
        <div>            
            <h2 className="text-2xl font-bold mb-4 text-[#ffffff]">Reset your password</h2>
            <input
                type="password"
                className="border px-4 py-2 mb-2 w-full text-[#ffffff]"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button w-full" onClick={updatePassword}>
                Update Password
            </button>
            {status && <p className="mt-2">{status}</p>}
        </div>
    </div>
  );
}
