"use client";

import { createContext, useContext } from "react";

const PageTransitionContext = createContext(null);

export function PageTransitionProvider({ value, children }) {
  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return context;
}
