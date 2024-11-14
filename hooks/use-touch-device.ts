import { useState, useEffect } from "react";

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
    
    setIsTouch(isTouchDevice);
  }, []);

  return isTouch;
}