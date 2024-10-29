"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useRive } from "@rive-app/react-canvas";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    document.title = "404 - Not Found";
    toast.dismiss();
    toast.error("Page not found, redirecting to home page...");
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);

  const { RiveComponent } = useRive({
    src: "/rive/car_404.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <div className="w-screen h-screen bg-[#dcdcea] flex items-center justify-center">
      <Toaster />
      <RiveComponent />
    </div>
  );
};

export default NotFound;