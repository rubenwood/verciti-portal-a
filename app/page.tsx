import Image from "next/image";
import LoginButton from "./login/login-button-component";
import LMSDashboard from "./lms/lms-dashboard-component";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20">
        <Image
          className="dark:invert"
          src="https://cdn.prod.website-files.com/66fc1efd047a029224c72fb0/66fc28b252d9d3641f6b168b_Verciti_Logo_Dark_Background.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <LoginButton />
        <LMSDashboard />
    </div>
  );
}
