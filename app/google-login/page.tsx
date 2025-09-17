"use client";
import { useEffect, useState } from "react";

export default function GoogleLoginButton() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);

      // Query params (?access_token=...)
      const at = url.searchParams.get("access_token");
      const rt = url.searchParams.get("refresh_token");

      // Hash params (#access_token=...)
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const hashAccess = hashParams.get("access_token");
      const hashRefresh = hashParams.get("refresh_token");

      setAccessToken(at || hashAccess);
      setRefreshToken(rt || hashRefresh);

      // Optional: clear tokens from URL so they don’t stay in history
      //window.history.replaceState({}, document.title, url.pathname);
    }
  }, []);

  const openApp = () => {
    if (!accessToken) return;

    const deeplink = `verciti://edtechapp?access_token=${encodeURIComponent(
      accessToken
    )}${refreshToken ? `&refresh_token=${encodeURIComponent(refreshToken)}` : ""}`;

    console.log("Deep link:", deeplink);
    window.location.href = deeplink;
  };

  return (
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
  );
}
