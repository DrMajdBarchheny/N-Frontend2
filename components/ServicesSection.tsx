"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building, Palette, Calendar, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { useEffect, useState } from "react";

// Fixed positions for background elements to avoid hydration mismatch
const BACKGROUND_ELEMENTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: (i * 17.3 + 5) % 100, // Deterministic positioning
  top: (i * 23.7 + 10) % 100,
  delay: i * 0.1,
  duration: 3 + (i % 3),
}));

export default function ServicesSection() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const services = [
    {
      icon: Building,
      titleKey: "services.exhibition",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      titleKey: "services.tradeshows",
      color: "from-[#E97B00] to-[#E97B00]",
    },
    {
      icon: Palette,
      titleKey: "services.interior",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      titleKey: "services.strategy",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section
      id="exhibition"
      className="relative min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
    >
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

      {/* Section Title */}
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
          {t("services.title1")}{" "}
          <span className="text-[#E97B00]">{t("services.title2")}</span>{" "}
          {t("services.title3")}
        </motion.h2>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 py-8">
          {/* Left: puzzle Image */}
          <motion.div
            className="flex-shrink-0 flex items-center justify-center w-full md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
          >
            <Image
              src="/pp.webp"  
              alt="puzzle"
              width={320}
              height={320}
              className="w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
              priority
            />
          </motion.div>
          {/* Right: services */}
          <div className="flex flex-col items-start w-full md:w-1/2">
            <div className="flex flex-col gap-4 sm:gap-6 w-full">
              {services.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: 3.2 + (index * 0.35), // Lowered delay for faster appearance
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.04 }}
                  className="group"
                >
                  <Card className="flex items-center gap-2 bg-white/95 shadow-lg rounded-full px-2 sm:px-4 py-1 sm:py-4 border-2 border-transparent group-hover:border-[#E97B00] group-hover:shadow-[0_0_0_4px_#E97B00]/40 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E97B00] flex items-center justify-center">
                      <service.icon className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                    </div>
                    <span className="text-xs md:text-lg font-semibold text-gray-900">
                      {t(service.titleKey)}
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
