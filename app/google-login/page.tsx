"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function GoogleLoginButton() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Check query string first (?access_token=)
    const at = searchParams.get("access_token");
    const rt = searchParams.get("refresh_token");

    // If Supabase sent tokens in the hash (#access_token=), parse manually
    if (!at && typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const hashAccess = hashParams.get("access_token");
      const hashRefresh = hashParams.get("refresh_token");

      if (hashAccess) setAccessToken(hashAccess);
      if (hashRefresh) setRefreshToken(hashRefresh);
    } else {
      if (at) setAccessToken(at);
      if (rt) setRefreshToken(rt);
    }
  }, [searchParams]);

  const openApp = () => {
    if (!accessToken) return;

    const deeplink = `verciti://edtechapp?access_token=${encodeURIComponent(
      accessToken
    )}${refreshToken ? `&refresh_token=${encodeURIComponent(refreshToken)}` : ""}`;

    console.log(deeplink);
    window.location.href = deeplink;
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
        <div>
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-2"
            onClick={openApp}
            disabled={!accessToken}
        >
            Return to Verciti App
        </button>

        {!accessToken && <p className="text-gray-500 mt-2">Just a sec!</p>}
        </div>
    </Suspense>
  );
}
