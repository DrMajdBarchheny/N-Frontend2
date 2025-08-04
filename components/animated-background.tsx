"use client"

import { useEffect, useState } from "react";

const BACKGROUND_ELEMENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i * 20 + 10) % 100,
  top: (i * 25 + 15) % 100,
  delay: i * 0.2,
  duration: 4 + (i % 2),
}));

export function AnimatedBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background dots - same as hero section */}
      {isMounted && (
        <div className="absolute inset-0">
          {BACKGROUND_ELEMENTS.map((element) => (
            <div
              key={element.id}
              className="absolute w-1 h-1 bg-white/15 rounded-full"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                animation: `floatY ${element.duration}s ease-in-out infinite`,
                animationDelay: `${element.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/12 to-transparent animate-gradient-shift"></div>
    </div>
  )
}
