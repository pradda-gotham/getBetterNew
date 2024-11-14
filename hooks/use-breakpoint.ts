import { useState, useEffect } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newBreakpoint = (Object.entries(breakpoints)
        .reverse()
        .find(([_, value]) => width >= value) || ["xs"])[0] as Breakpoint;
      
      setBreakpoint(newBreakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}