"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      window.location.href = `/reset-password${hash}`;
    }
  }, [router]);

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
      <div>
          <Image
            className="dark:invert"
            src="https://cdn.prod.website-files.com/66fc1efd047a029224c72fb0/66fc28b252d9d3641f6b168b_Verciti_Logo_Dark_Background.svg"
            alt="Verciti logo"
            width={180}
            height={38}
            priority
          />
          <br/>
          <Link href="/login" className="button">
            Login
          </Link>
          <br/>
        </div>
    </div>
  );
}
