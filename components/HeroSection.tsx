"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  heroY: any;
  heroScale: any;
  scrollToSection: (href: string) => void;
}

const BACKGROUND_ELEMENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i * 20 + 10) % 100,
  top: (i * 25 + 15) % 100,
  delay: i * 0.2,
  duration: 4 + (i % 2),
}));

export default function HeroSection({
  heroY,
  heroScale,
  scrollToSection,
}: HeroSectionProps) {
  const { t, language } = useLanguage();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
    // Check if mobile
    setIsMobile(window.innerWidth <= 768);
    // Start the loading animation sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    if (!isMounted) return;

    // Disable mouse tracking on mobile for better performance
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 80,
        y: (e.clientY - window.innerHeight / 2) / 80,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted, isMobile]);

  // Simplified geometric shapes data
  const geometricShapes = [
    { type: "circle", size: 120, color: "bg-blue-500", x: 70, y: 20, delay: 0 },
    { type: "square", size: 80, color: "bg-blue-700", x: 85, y: 60, delay: 0.2 },
    { type: "circle", size: 60, color: "bg-blue-200", x: 80, y: 70, delay: 0.4 },
    { type: "square", size: 100, color: "bg-blue-400", x: 75, y: 35, delay: 0.6 },
    { type: "circle", size: 40, color: "bg-blue-300", x: 90, y: 80, delay: 0.8 },
    { type: "square", size: 70, color: "bg-blue-600", x: 60, y: 50, delay: 1.0 },
    { type: "circle", size: 90, color: "bg-blue-800", x: 65, y: 75, delay: 1.2 },
    { type: "square", size: 60, color: "bg-blue-300", x: 80, y: 55, delay: 1.4 },
    { type: "circle", size: 50, color: "bg-blue-400", x: 78, y: 30, delay: 1.6 },
    { type: "square", size: 90, color: "bg-blue-200", x: 72, y: 65, delay: 1.8 },
    { type: "circle", size: 80, color: "bg-blue-400", x: 36, y: 48, delay: 2.0 },
    { type: "square", size: 60, color: "bg-blue-500", x: 22, y: 50, delay: 2.2 },
    { type: "circle", size: 70, color: "bg-blue-300", x: 30, y: 54, delay: 2.4 },
    { type: "square", size: 50, color: "bg-blue-600", x: 25, y: 60, delay: 2.6 },
    { type: "circle", size: 60, color: "bg-blue-900", x: 20, y: 46, delay: 2.8 },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background quarter-circle with entrance animation */}
      <motion.div
        className={`absolute ${language === 'ar' 
          ? 'md:-left-44 -left-20' 
          : 'md:-right-44 -right-20'} 
          ${language === 'ar' 
            ? 'md:-top-52 -top-20' 
            : 'md:-top-52 -top-20'} 
          w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] z-10 pointer-events-none`}
        style={
          language === 'ar'
            ? {
                borderBottomRightRadius: '100vw',
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                overflow: 'hidden',
              }
            : {
                borderBottomLeftRadius: '100vw',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                overflow: 'hidden',
              }
        }
        initial={{ scale: isMobile ? 1 : 8, opacity: 1 }}
        animate={{ 
          scale: isLoading ? (isMobile ? 1 : 8) : (isMobile ? 1 : [1, 0.98, 1]), 
          opacity: isLoading ? 1 : (isMobile ? 0.8 : [0.8, 0.9, 0.8]) 
        }}
        transition={{ 
          scale: { 
            duration: isLoading ? (isMobile ? 0.5 : 2.0) : (isMobile ? 0 : 20), 
            ease: isLoading ? "easeOut" : (isMobile ? "linear" : "easeInOut"),
            repeat: isLoading ? 0 : (isMobile ? 0 : Infinity)
          },
          opacity: { 
            duration: isLoading ? (isMobile ? 0.5 : 2.0) : (isMobile ? 0 : 20), 
            ease: isLoading ? "easeOut" : (isMobile ? "linear" : "easeInOut"),
            repeat: isLoading ? 0 : (isMobile ? 0 : Infinity)
          }
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(225deg, #FFD9A0 0%, #E97B00 60%, #B85C00 100%)',
            width: '100%',
            height: '100%',
          }}
        />
      </motion.div>

      {/* Simplified background elements */}
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

      {/* Content container with staggered reveal */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 2.6 }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            className={`space-y-6 sm:space-y-8 pt-16 sm:pt-20 text-center ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}
            style={{
              y: heroY,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 40 : 0 }}
              transition={{ duration: isMobile ? 0.8 : 1.2, delay: isMobile ? 1.0 : 3.1, ease: "easeOut" }}
            >
              <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none text-white">
                <motion.span
                  className={`inline sm:block ${language === 'ar' ? 'mx-2' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  WE GET
                </motion.span>
                <span className="inline sm:block relative ml-1.5 sm:ml-0">
                  <motion.span
                    className="relative z-10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    IT DONE
                  </motion.span>
                  <motion.div
                    className="absolute bottom-1 sm:bottom-2 left-0 h-1 sm:h-3 -z-10"
                    style={{ backgroundColor: "#E97B00" }}
                    initial={{ width: 0, boxShadow: "0 0 0px #E97B00" }}
                    animate={{
                      width: isLoading ? 0 : "100%",
                      boxShadow: isLoading ? "0 0 0px #E97B00" : (isMobile ? "0 0 0px #E97B00" : [
                        "0 0 0px #E97B00",
                        "0 0 16px 4px #E97B00",
                        "0 0 0px #E97B00",
                        "0 0 24px 8px #E97B00",
                        "0 0 0px #E97B00",
                        "0 0 12px 2px #E97B00",
                        "0 0 0px #E97B00",
                        "0 0 20px 6px #E97B00",
                        "0 0 0px #E97B00",
                      ]),
                    }}
                    transition={{
                      width: { duration: isMobile ? 1.0 : 1.5, delay: isMobile ? 1.8 : 3.9, ease: "easeOut" },
                      boxShadow: {
                        delay: isMobile ? 0 : 5.3,
                        duration: isMobile ? 0 : 2,
                        repeat: isMobile ? 0 : Infinity,
                        repeatType: "loop",
                        times: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
                        ease: "linear",
                      },
                    }}
                  />
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
              transition={{ duration: isMobile ? 0.8 : 1.2, delay: isMobile ? 1.2 : 3.5, ease: "easeOut" }}
              whileHover={{ scale: isMobile ? 1 : 1.01 }}
            >
              {t("hero.description")}
            </motion.p>
            
            <motion.div
              className="mx-auto lg:mx-0 mt-4 h-1 sm:h-3 w-full max-w-lg relative"
              style={{ backgroundColor: "#3B82F6" }}
              initial={{ width: 0, boxShadow: "0 0 0px #3B82F6" }}
              animate={{
                width: isLoading ? 0 : "100%",
                boxShadow: isLoading ? "0 0 0px #3B82F6" : (isMobile ? "0 0 0px #3B82F6" : [
                  "0 0 0px #3B82F6",
                  "0 0 16px 4px #3B82F6",
                  "0 0 0px #3B82F6",
                  "0 0 24px 8px #3B82F6",
                  "0 0 0px #3B82F6",
                  "0 0 12px 2px #3B82F6",
                  "0 0 0px #3B82F6",
                  "0 0 20px 6px #3B82F6",
                  "0 0 0px #3B82F6",
                ]),
              }}
              transition={{
                width: { duration: isMobile ? 1.0 : 1.5, delay: isMobile ? 2.0 : 4.3, ease: "easeOut" },
                boxShadow: {
                  delay: isMobile ? 0 : 5.8,
                  duration: isMobile ? 0 : 2,
                  repeat: isMobile ? 0 : Infinity,
                  repeatType: "loop",
                  times: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
                  ease: "linear",
                },
              }}
            />
          </motion.div>

          {/* Right side - Geometric composition */}
          <motion.div
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] order-first lg:order-last"
            style={{
              scale: heroScale,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
          >
            {/* Geometric shapes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {geometricShapes.map((shape, index) => (
                <motion.div
                  key={index}
                  className={`absolute ${shape.color} ${
                    shape.type === "circle" ? "rounded-full" : "rounded-lg"
                  }`}
                  style={{
                    width: shape.size * 0.7,
                    height: shape.size * 0.7,
                    left: `${shape.x}%`,
                    top: `${shape.y}%`,
                    x: isMounted ? mousePosition.x * (index % 2 === 0 ? 0.5 : -0.5) : 0,
                    y: isMounted ? mousePosition.y * (index % 2 === 0 ? 0.5 : -0.5) : 0,
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ opacity: 0, scale: 0.5, rotateZ: -90 }}
                  animate={{ 
                    opacity: isLoading ? 0 : (isMobile ? 0.6 : 0.8), 
                    scale: isLoading ? 0.5 : (isMobile ? 0.8 : 1), 
                    rotateZ: isLoading ? -90 : (isMobile ? 0 : 0) 
                  }}
                  transition={{
                    duration: isMobile ? 0.5 : 1.2,
                    delay: isLoading ? 0 : (isMobile ? shape.delay + 0.5 : shape.delay + 3.1),
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: isMobile ? 1 : 1.1,
                    rotateZ: isMobile ? 0 : 45,
                  }}
                />
              ))}
            </div>
            
            {/* Floating ring - Only on large screens */}
            <div className="hidden lg:block">
              <motion.div
                className="absolute top-10 right-10 w-16 h-16 xl:w-20 xl:h-20 border-4 border-white rounded-full"
                animate={{
                  rotate: isLoading ? 0 : (isMobile ? 0 : 360),
                }}
                transition={{
                  rotate: {
                    duration: isMobile ? 0 : 25,
                    repeat: isMobile ? 0 : Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: isMobile ? 0 : 3.1,
                  },
                }}
                whileHover={{ scale: isMobile ? 1 : 1.1 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: isLoading ? 0 : (isMobile ? 0 : [0, 8, 0]),
        }}
        transition={{ 
          duration: isMobile ? 0 : 2.5, 
          repeat: isMobile ? 0 : Number.POSITIVE_INFINITY, 
          ease: "easeInOut",
          delay: isMobile ? 0 : 4.6
        }}
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2"
            animate={{ y: isLoading ? 0 : (isMobile ? 0 : [0, 6, 0]) }}
            transition={{ 
              duration: isMobile ? 0 : 2.5, 
              repeat: isMobile ? 0 : Number.POSITIVE_INFINITY, 
              ease: "easeInOut",
              delay: isMobile ? 0 : 4.6
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
