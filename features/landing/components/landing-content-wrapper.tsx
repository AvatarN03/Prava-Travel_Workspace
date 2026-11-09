"use client";

import { useEffect, useState } from "react";

import { LandingIntroLoader } from "./landing-intro-loader";

import { cn } from "@/lib/utils";

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
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isIntroComplete]);

  const handleDissolve = () => {
    setIsDissolving(true);
    window.scrollTo(0, 0);
  };

  const handleComplete = () => {
    setIsIntroComplete(true);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
  };

  return (
    <>
      {!isIntroComplete && (
        <LandingIntroLoader
          onDissolve={handleDissolve}
          onComplete={handleComplete}
        />
      )}

      <div
        id="prava-landing-root"
        className={cn(
          "transform-gpu transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform,filter]",
          !isDissolving
            ? "pointer-events-none opacity-0 scale-[0.985] blur-[3px]"
            : "pointer-events-auto opacity-100 scale-100 blur-0"
        )}
      >
        {children}
      </div>
    </>
  );
}

export default LandingContentWrapper;
