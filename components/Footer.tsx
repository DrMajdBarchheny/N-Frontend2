"use client"

import { color, motion } from "framer-motion"
import { Phone, Mail, MapPin, InstagramIcon, Facebook, Linkedin, Download } from "lucide-react"

import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Fixed positions for background elements to avoid hydration mismatch
const BACKGROUND_ELEMENTS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: (i * 20 + 10) % 100,
  top: (i * 25 + 15) % 100,
  delay: i * 0.2,
  duration: 4 + (i % 2),
}))

function scrollToSectionFooter(href: string) {
  if (href.startsWith("/")) {
    window.location.href = href;
    return;
  }
  const element = document.querySelector(href);
  if (element) {
    const yOffset = -96; // Adjust this value to your header's height in px
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  } else {
    // If element doesn't exist on current page, navigate to homepage first
    window.location.href = "/" + href;
  }
}

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
    // Start the loading animation sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      title: t("footer.services"),
      items: [
        t("footer.exhibition"),
        t("footer.tradeshow"),
        t("footer.interior"),
        t("footer.event"),
        
      
      ],
    },
    {
      title: t("footer.company"),
      items: [
        t("footer.about"),
        t("footer.whatwedo"),
        t("footer.projects"),  
        t("footer.downloadProfile"),
        
      
      ],
    },
  ]

  const contactInfo = [
    { icon: MapPin, text: t("footer.address") },
    { icon: Phone, text: t("footer.phone") },
    { icon: Mail, text: t("footer.email") },
  ]

  const socialIcons = [InstagramIcon, Facebook, Linkedin]

  return (
    <motion.footer
      className="bg-gray-900 border-t border-gray-800 py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ transformStyle: "preserve-3d" }}
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
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                rotateZ: [0, 360],
                scale: [1, 1.5, 1],
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

      {/* Blue circle background with entrance animation */}
     

      {/* Content container with staggered reveal */}
      <motion.div 
        className="container mx-auto px-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 2.8 }}
      >
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          <motion.div whileHover={{ rotateY: 5, scale: 1.02 }} style={{ transformStyle: "preserve-3d" }}>
            <motion.div className={`flex items-center mb-6 ${isRTL ? '-mr-12' : '-ml-12'}`} whileHover={{ rotateX: 10 }}>
              <motion.div
                className="w-56 h-20 text-gray-900 rounded-sm flex items-center justify-center font-bold"
                
                transition={{ duration: 0.9 }}
              >
                <Image src="/nijara_logo_rev.webp" alt="Logo" width={40} height={40} className="size-fit" priority/>
              </motion.div>
            </motion.div>
            <motion.p className="text-gray-300 mb-6 leading-relaxed" whileHover={{ rotateX: 3, scale: 1.02 }}>
              {t("footer.description")}
            </motion.p>
            <div className="flex">
              {[
                { Icon: InstagramIcon, url: "https://www.instagram.com/nijaragram?igsh=MTA3MXVjeHY4dDV4Mg=="},
                { Icon: Facebook, url: "https://www.facebook.com/share/1YqETV4dvp/?mibextid=wwXIfr" },
                
                { Icon: Linkedin, url: "https://www.linkedin.com/company/nijarallc/" },
              ].map(({ Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={url}
                >
                  <motion.button
                    className="w-10 h-10 mx-2 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    whileTap={{ scale: 0.95 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.button>
                </a>
              ))}
            </div>
          </motion.div>

          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              whileHover={{ rotateY: 5, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.h4 className="text-lg font-semibold mb-6 text-white" whileHover={{ rotateX: 10, scale: 1.05 }}>
                {section.title}
              </motion.h4>
              <ul className="space-y-3 text-gray-300">
                {section.items.map((item, index) => (
                  <li key={item}>
                    {/* About Us smooth scroll */}
                    {item === t("footer.about") ? (
                      <motion.a
                        href="#about-us"
                        onClick={e => {
                          e.preventDefault();
                          scrollToSectionFooter("#about-us");
                        }}
                        className="hover:text-white transition-colors text-left cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item}
                      </motion.a>
                    ) : item === t("footer.whatwedo") ? (
                      <motion.a
                        href="#what-we-do"
                        onClick={e => {
                          e.preventDefault();
                          scrollToSectionFooter("#what-we-do");
                        }}
                        className="hover:text-white transition-colors text-left cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item}
                      </motion.a>
                    ) : item === t("footer.downloadProfile") ? (
                      <motion.a
                        href="/Nijara-CompanyProfile.pdf"
                        download="Nijara-CompanyProfile.pdf"
                        className="flex items-center hover:text-white transition-colors text-left cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        
                        whileTap={{ scale: 0.98 }}
                      >
                        
                        {item}
                      </motion.a>
                    ) : item === t("footer.projects") ? (
                      <motion.a
                        href="/our-work"
                        className="hover:text-white transition-colors text-left cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item}
                      </motion.a>
                    ) : (
                      <motion.span
                        className="hover:text-white transition-colors text-left"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item}
                      </motion.span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div whileHover={{ rotateY: 5, scale: 1.02 }} style={{ transformStyle: "preserve-3d" }}>
            <motion.h4 className="text-lg font-semibold mb-6 text-white" whileHover={{ rotateX: 10, scale: 1.05 }}>
              {t("footer.contact")}
            </motion.h4>
            <ul className="space-y-3 text-gray-300">
              {contactInfo.map((contact, index) => (
                <motion.li
                  key={contact.text}
                  className="flex items-center mr-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div whileHover={{ rotateZ: 15, scale: 1.2 }}>
                    <contact.icon className="h-4 w-4 mr-3 text-[#E97B00]" />
                  </motion.div>
                  {contact.icon === MapPin ? (
                    <a
                      href="https://www.google.com/maps/place/25.122664612544895, 55.23562289275642"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    contact.text
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-800 pt-8 text-center text-gray-400"
          whileHover={{ rotateX: 5, scale: 1.02 }}
        >
          <p>{t("footer.copyright")}</p>
        </motion.div>
      </motion.div>
    </motion.footer>
  )
}
