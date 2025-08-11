import { useEffect, useState } from "react";

interface UseScrollReturn {
  scrollY: number;
  mounted: boolean;
}

// Hook for managing scroll-based parallax effect
export function useScroll(): UseScrollReturn {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, mounted };
}