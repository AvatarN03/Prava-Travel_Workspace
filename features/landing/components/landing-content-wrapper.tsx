"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { LandingIntroLoader } from "./landing-intro-loader";

import { cn } from "@/lib/utils";

interface LandingIntroContextValue {
  isIntroDissolving: boolean;
  isIntroComplete: boolean;
}

const LandingIntroContext = createContext<LandingIntroContextValue>({
  isIntroDissolving: true,
  isIntroComplete: true,
});

export function useLandingIntro() {
  return useContext(LandingIntroContext);
}

interface LandingContentWrapperProps {
  children: React.ReactNode;
}

export function LandingContentWrapper({ children }: LandingContentWrapperProps) {
  const [isDissolving, setIsDissolving] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  useEffect(() => {
    // Lock scroll to top and prevent browser scroll restoration from skipping the top
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    if (!isIntroComplete) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isIntroComplete]);

  const handleDissolve = () => {
    setIsDissolving(true);
    window.scrollTo(0, 0);
  };

  const handleComplete = () => {
    setIsIntroComplete(true);
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);
  };

  return (
    <LandingIntroContext.Provider
      value={{
        isIntroDissolving: isDissolving,
        isIntroComplete,
      }}
    >
      {!isIntroComplete && (
        <LandingIntroLoader
          onDissolve={handleDissolve}
          onComplete={handleComplete}
        />
      )}

      <div
        id="prava-landing-root"
        className={cn(
          !isDissolving ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        {children}
      </div>
    </LandingIntroContext.Provider>
  );
}

export default LandingContentWrapper;
