import { useCallback, useEffect, useState } from "react";

export const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(${width})`);
    media.addEventListener("change", (e) => updateTarget(e));

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", (e) => updateTarget(e));
  }, []);

  return targetReached;
};

export const useIsSM = () => useMediaQuery("min-width: 640px");
export const useIsMD = () => useMediaQuery("min-width: 768px");
export const useIsBelowMD = () => useMediaQuery("max-width: 767px");
