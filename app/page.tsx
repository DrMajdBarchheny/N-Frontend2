"use client";

import { useScroll, useTransform, useSpring } from "framer-motion";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

// Import essential components directly
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

// Dynamically import heavy components (Lazy Loading)
const WhoWeAre = dynamic(() => import("@/components/WhoWeAre"));
const AboutUsSection = dynamic(() => import("@/components/AboutUsSection"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const TeamSection = dynamic(() => import("@/components/TeamSection"));
const ClientsSection = dynamic(() => import("@/components/ClientsSection"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));
const RequestDesignForm = dynamic(
  () => import("@/components/RequestDesignForm")
);

// Separator component with animations
const SectionSeparator = () => (
  <motion.div
    className="flex justify-center py-8"
    initial={{ opacity: 0, scaleX: 0 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#E97B00] to-transparent"
      whileHover={{
        scaleX: 1.1,
        boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
      }}
      transition={{ duration: 0.3 }}
    />
  </motion.div>
);

export default function HomePage() {
  const { scrollY } = useScroll();
  const { language, t } = useLanguage();

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heroY = useSpring(
    useTransform(scrollY, [0, 500], [0, -150]),
    springConfig
  );
  const heroScale = useSpring(
    useTransform(scrollY, [0, 500], [1, 1.1]),
    springConfig
  );

  const navigation = [
    { name: t("nav.HomePage"), href: "/" },
    { name: t("nav.whatWeDo"), href: "#what-we-do" },
    { name: t("nav.work"), href: "/our-work" },
    
    // { name: t("nav.team"), href: "#team" },
    // { name: t("nav.clients"), href: "#clients" },
    { name: t("nav.contact"), href: "#footer" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -96; // Adjust this value to your header's height in px
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // RequestDesignForm open/close state
  const [isRequestFormOpen, setRequestFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const openRequestForm = () => setRequestFormOpen(true);
  const closeRequestForm = () => setRequestFormOpen(false);

  useEffect(() => {
    // Coordinate with the circle animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Match the circle animation duration
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Floating Request Design Button */}
      {!isRequestFormOpen && (
        <motion.div
          className={`fixed bottom-8 ${language == 'ar' ? 'right-8 ': 'left-8' } z-50`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: isLoading ? 100 : 0, opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Button
              onClick={openRequestForm}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 text-xs sm:text-base px-4 py-2 sm:px-6 sm:py-6 rounded-full"
            >
              <MessageSquare className="h-6 w-6 mr-1" />
              {t("nav.requestDesign")}
            </Button>
          </motion.div>
        </motion.div>
      )}
      {/* RequestDesignForm controlled by state */}
      <RequestDesignForm isOpen={isRequestFormOpen} onClose={closeRequestForm} />
      {/* Header */}
      <Header
        scrollY={scrollY}
        navigation={navigation}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <HeroSection
        heroY={heroY}
        heroScale={heroScale}
        scrollToSection={scrollToSection}
      />

      <SectionSeparator />

      {/* WhoWeAre Section */}
      <WhoWeAre />

      <SectionSeparator />

      {/* AboutUs Section */}
      <AboutUsSection />

      <SectionSeparator />

      {/* Services Section */}
      <div id="what-we-do" className="scroll-mt-24">
        <ServicesSection />
      </div>
      
      <SectionSeparator />

      {/* Team Section */}
      <div id="team">
        <TeamSection />
      </div>
      
      <SectionSeparator />

      {/* Contact CTA Section */}
      <ContactSection scrollToSection={scrollToSection} onStartProject={openRequestForm} />

      <SectionSeparator />

      {/* Clients Section */}
      <motion.h2 
        className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#E97B00] mb-10 mt-1 text-center w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {t("client.our")} <span className="text-white">{t("client.clients")}</span>{" "}
      </motion.h2>
      <section id="clients">
        <ClientsSection />
      </section>

      {/* Footer */}
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
} 
