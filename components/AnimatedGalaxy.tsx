"use client";

import { useEffect, useState, useMemo } from "react";

const AnimatedGalaxy = () => {
  const [mounted, setMounted] = useState(false); // Solve hydration error
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate star positions once and memoize them
  const stars = useMemo(() => {
    return [...Array(150)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1, // Random size between 1-3px
      parallaxSpeed: Math.random() * 15 + 5, // Random speed for parallax effect
    }));
  }, []);

  useEffect(() => {
    setMounted(true); // Solve hydration error
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  } // Solve hydration error

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-black/10" />
      {stars.map((star, i) => (
        <div
          key={i}
          className="star absolute"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            transform: mounted
              ? `translate(${mousePosition.x * star.parallaxSpeed}px, ${
                  mousePosition.y * star.parallaxSpeed
                }px)`
              : "none",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedGalaxy;
