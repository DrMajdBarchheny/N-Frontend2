"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PenTool, Users, HandIcon, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

// Fixed positions for background elements to avoid hydration mismatch
const BACKGROUND_ELEMENTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: (i * 17.3 + 5) % 100, // Deterministic positioning
  top: (i * 23.7 + 10) % 100,
  delay: i * 0.1,
  duration: 3 + (i % 3),
}));
const features = [
  {
    icon: PenTool,
    textKey: "whoWeAre.designExcellence",
    color: "text-[#E97B00]",
  },
  {
    icon: Users,
    textKey: "whoWeAre.customerOriented",
    color: "text-[#E97B00]",
  },
  {
    icon: HandIcon,
    textKey: "whoWeAre.reliablePartner",
    color: "text-[#E97B00]",
  },
  {
    icon: Clock,
    textKey: "whoWeAre.timeBound",
    color: "text-[#E97B00]",
  },
];

export default function WhoWeAre() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [glowX, setGlowX] = useState(60); // X coordinate (0-100)
  const [glowY, setGlowY] = useState(1); // Y coordinate (0-100)

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background elements - Only render on client */}
      {isMounted && (
        <div className="absolute inset-0">
          {BACKGROUND_ELEMENTS.map((element) => (
            <div
              key={element.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full hero-float"
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

      {/* Title at the top center */}
      <motion.h2 
        className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-8 mt-8 text-center w-full relative z-10"
        initial={{ opacity: 0, y: 100, scale: 2 }}
        whileInView={{ 
          opacity: [0, 1, 1], 
          y: [100, 0, 0], 
          scale: [2, 2, 1] 
        }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 2.0, 
          delay: 0.5, 
          ease: "easeOut",
          times: [0, 0.4, 1] // 40% of time to slide up, 60% to shrink
        }}
      >
        {t("whoWeAre.title1")}{" "}
        <span className="text-[#E97B00]">{t("whoWeAre.title2")}</span>{" "}
        {t("whoWeAre.title3")}
      </motion.h2>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 py-8">
        {/* Left: Lamp Image */}
        <motion.div
          className="flex-shrink-0 flex items-center justify-center w-full md:w-1/2 mb-10 md:mb-0"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ 
            opacity: 1, 
            y: 0
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ 
            duration: 1.5,
            delay: 2.5, // Start after title finishes shrinking
            ease: "easeOut"
          }}
        >
          <motion.div
            
            transition={{
              boxShadow: {
                delay: 2.8, // Start pulsing after reaching final position
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative"
          >
            {/* Glow effect under the image */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  // Light bulb glow - soft orange/yellow aura emanating from the bulb
                  // "radial-gradient(ellipse at 50% 50%, rgba(255, 193, 7, 0.2) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(ellipse at 50% 50%, rgba(255, 193, 7, 0.4) 0%, rgba(233, 123, 0, 0.2) 40%, rgba(233, 123, 0, 0.05) 60%, transparent 80%)",
                  // "radial-gradient(ellipse at 50% 50%, rgba(255, 193, 7, 0.6) 0%, rgba(233, 123, 0, 0.3) 50%, rgba(233, 123, 0, 0.1) 70%, transparent 90%)",
                  // "radial-gradient(ellipse at 50% 50%, rgba(255, 193, 7, 0.4) 0%, rgba(233, 123, 0, 0.2) 40%, rgba(233, 123, 0, 0.05) 60%, transparent 80%)",
                  // "radial-gradient(ellipse at 50% 50%, rgba(255, 193, 7, 0.2) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  
                  // Glow centered on the red dot (above 'j' in nijara)
                  // "radial-gradient(circle at 60% 20%, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  // "radial-gradient(circle at 60% 20%, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at 60% 20%, rgba(233, 123, 0, 0.6) 0%, rgba(233, 123, 0, 0.2) 40%, transparent 70%)",
                  // "radial-gradient(circle at 60% 20%, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at 60% 20%, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  
                  // Option 1: Bulb center glow (positioned at bulb center)
                  // `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(233, 123, 0, 0) 0%, transparent 90%)`,
                  // `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 40%, transparent 90%)`,
                  // `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(233, 123, 0, 0.6) 0%, rgba(233, 123, 0, 0.2) 50%, transparent 90%)`,
                  // `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 40%, transparent 90%)`,
                  // `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(233, 123, 0, 0) 0%, transparent 90%)`,
                  
                  // Option 2: Bottom glow
                  // "radial-gradient(circle at bottom, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  // "radial-gradient(circle at bottom, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at bottom, rgba(233, 123, 0, 0.6) 0%, rgba(233, 123, 0, 0.2) 40%, transparent 70%)",
                  // "radial-gradient(circle at bottom, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at bottom, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  
                  // Option 3: Top glow
                  // "radial-gradient(circle at top, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  // "radial-gradient(circle at top, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at top, rgba(233, 123, 0, 0.6) 0%, rgba(233, 123, 0, 0.2) 40%, transparent 70%)",
                  // "radial-gradient(circle at top, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at top, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  
                  // Option 4: Custom position (e.g., 30% from left, 70% from top)
                  // "radial-gradient(circle at 40% 70%, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                  // "radial-gradient(circle at 40% 70%, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at 40% 70%, rgba(233, 123, 0, 0.6) 0%, rgba(233, 123, 0, 0.2) 40%, transparent 70%)",
                  // "radial-gradient(circle at 40% 70%, rgba(233, 123, 0, 0.3) 0%, rgba(233, 123, 0, 0.1) 30%, transparent 70%)",
                  // "radial-gradient(circle at 40% 70%, rgba(233, 123, 0, 0) 0%, transparent 70%)",
                ],
              }}
              transition={{
                background: {
                  delay: 2.8,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
            <Image
              src="/Who We Are.webp"
              alt="nijara lamp"
              width={320}
              height={320}
              className="w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain relative z-10"
              priority
            />
          </motion.div>
        </motion.div>
        
        {/* Right: Features */}
        <div className="flex flex-col items-start w-full md:w-1/2">
          <div className="flex flex-col gap-4 sm:gap-6 w-full">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.textKey}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.9,
                  delay: 3.2 + (idx * 0.35), // Lowered delay for faster appearance
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.04 }}
                className="group"
              >
                <Card className="flex items-center gap-2 bg-white/95 shadow-lg rounded-full px-2 sm:px-4 py-1 sm:py-4 border-2 border-transparent group-hover:border-[#E97B00] group-hover:shadow-[0_0_0_4px_#E97B00]/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E97B00] flex items-center justify-center">
                    <feature.icon className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                  </div>
                  <span className="text-xs md:text-lg font-semibold text-gray-900">
                    {t(feature.textKey)}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
