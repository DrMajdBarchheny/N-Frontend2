"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Fixed positions for background elements to avoid hydration mismatch
const BACKGROUND_ELEMENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i * 20 + 10) % 100,
  top: (i * 25 + 15) % 100,
  delay: i * 0.2,
  duration: 4 + (i % 2),
}))

export default function AboutUsSection() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section
      id="about-us"
      className="py-12 sm:py-20 md:py-24 lg:py-16 relative overflow-hidden"
    >
      {/* Animated background elements - Only render on client */}
      {isMounted && (
        <div className="absolute inset-0">
          {BACKGROUND_ELEMENTS.map((element) => (
            <motion.div
              key={element.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: element.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-gray-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 30, scale: 2 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            {t("aboutUs.ourJourney")}
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl  font-bold mb-4 sm:mb-6 text-white"
            initial={{ opacity: 0, y: 40, scale: 2 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.0, delay: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            {t("aboutUs.about")}
            <motion.span
              className="inline text-[#E97B00] ml-2 sm:ml-4"
              whileHover={{ rotateX: 15 }}
            >
                  {t("aboutUs.nijara")}
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-2xl text-gray-300 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed -pr-10 -pl-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 3.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            {t("aboutUs.intro")}
          </motion.p>
        </motion.div>

        {/* Timeline */}
        
      </div>
    </section>
  );
}
