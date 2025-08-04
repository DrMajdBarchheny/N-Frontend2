"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import Link from "next/link";

// Fixed positions for background elements to avoid hydration mismatch
const BACKGROUND_ELEMENTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: (i * 17.3 + 5) % 100, // Deterministic positioning
  top: (i * 23.7 + 10) % 100,
  delay: i * 0.1,
  duration: 3 + (i % 3),
}));

interface ContactSectionProps {
  scrollToSection: (href: string) => void;
  onStartProject: () => void;
}

export default function ContactSection({
  scrollToSection,
  onStartProject,
}: ContactSectionProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="contact" className="py-32 relative">
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

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold mb-10 leading-[1.15]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ rotateY: 5, scale: 1.02 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {t("contact.title1")}
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400 pb-6 pt-4"
              whileHover={{ rotateX: 15, rotateY: -10 }}
            >
              {t("contact.title2")}
            </motion.span>
          </motion.h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#e97b00] to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-6 text-sm md:text-lg font-medium"
                onClick={onStartProject}
              >
                {t("contact.startProject")}
                <motion.div whileHover={{ x: 5, rotateZ: 15 }}>
                  <ArrowRight className="ml-3 h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link href="/our-work">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-6 text-sm md:text-lg font-medium bg-transparent"
                onClick={() => scrollToSection("#rental")}
              >
                {t("contact.browseCatalog")}
              </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
