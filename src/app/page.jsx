"use client";

import { useState, useEffect } from "react";
import { Nav, SplashScreen } from "@/components";
import ScrollSmootherWrapper from "@/components/ScrollSmoother/ScrollSmootherWrapper";
import { Home, Projects, About, Footer } from "@/sections";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTimer = () => {
      setCurrentTime(new Date());
    };
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;

  if (isLoading) {
    return <SplashScreen setIsLoading={setIsLoading} />;
  }

  return (
    <>
      <Nav formattedTime={formattedTime} />
      <ScrollSmootherWrapper>
        <main className="main flex flex-col items-center justify-center w-full bg-black">
          <Home />
          <Projects />
          <About />
          <Footer formattedTime={formattedTime} />
        </main>
      </ScrollSmootherWrapper>
    </>
  );
}
