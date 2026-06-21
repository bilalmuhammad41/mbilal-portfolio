"use client";

import { useState, useEffect } from "react";
import { Nav, SplashScreen } from "@/components";
import ThemeProvider from "@/components/Theme/ThemeProvider";
import PageTransitionShell from "@/components/PageTransition/PageTransitionShell";

export default function SiteShell() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;

  if (isLoading) {
    return (
      <ThemeProvider>
        <SplashScreen setIsLoading={setIsLoading} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <PageTransitionShell formattedTime={formattedTime}>
        <Nav formattedTime={formattedTime} />
      </PageTransitionShell>
    </ThemeProvider>
  );
}
