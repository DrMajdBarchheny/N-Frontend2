"use client";

import { useState, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface HeaderProps {
  scrollY?: any;
  navigation: Array<{ name: string; href: string }>;
  scrollToSection: (href: string) => void;
}

export default function Header({
  scrollY,
  navigation,
  scrollToSection,
}: HeaderProps) {
  const { t, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
    
    // Coordinate with the circle animation - start after circle completely finishes shrinking
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Match the circle animation duration exactly
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  const headerOpacity = scrollY
    ? useTransform(scrollY, [0, 100], [0.95, 0.95])
    : 1;

  return (
    <motion.header
      className="fixed top-0 w-full z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800"
      style={{
        opacity: headerOpacity,
        transform: "translateZ(0)",
      }}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -100 : 0 }}
      transition={{ duration: 0.6, delay: 2.2, ease: "easeOut" }}
      whileHover={{
        rotateX: 2,
        transition: { duration: 0.3 },
      }}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center flex-shrink-0"
            whileHover={{
              scale: 1.05,
              rotateY: 10,
              rotateX: 5,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="w-28 h-28 sm:w-52 sm:h-20 text-gray-900 rounded-sm flex items-center justify-center font-bold text-lg"
              transition={{ duration: 0.9, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/nijara_logo_rev.webp"
                alt="Logo"
                width={100}
                height={100}
                className="w-28 h-28 sm:w-52 sm:h-20 object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Navigation */}
          <nav className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => {
                  scrollToSection(item.href);
                  setActiveSection(item.href);
                }}
                className={`transition-colors text-base font-medium tracking-wide relative ${
                  activeSection === item.href
                    ? "text-[#E97B00]"
                    : "text-gray-300 hover:text-[#E97B00]"
                } hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white hover:after:transition-all hover:after:duration-300`}
                whileHover={{
                  y: -2,
                  rotateX: 10,
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                initial={{ opacity: 0, y: -20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transformStyle: "preserve-3d",
                }}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-1" : "space-x-1"}`}>
            <LanguageSwitcher />
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                  <Link href="/profile" passHref legacyBehavior>
                <Button variant="ghost" size="sm" className="hidden md:flex text-gray-300 hover:text-black">
                    <User className="w-5 h-5" />
                </Button>
                </Link>
                <Button variant="ghost" size="sm" className="hidden md:flex text-gray-300 hover:text-red-500" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-1" /> {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  whileHover={{
                    rotateY: 15,
                    scale: 1.05,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link href="/login" passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden md:flex text-gray-300 hover:text-black"
                    >
                      {t("nav.login")}
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{
                    rotateY: -15,
                    scale: 1.05,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link href="/register" passHref legacyBehavior>
                    <Button
                      size="sm"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 hidden md:flex"
                    >
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}

            <motion.div
              whileHover={{ rotateZ: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`lg:hidden ${isRTL ? "mr-3" : "ml-3"}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden mt-6 pb-6 border-t border-gray-800"
            initial={{ opacity: 0, height: 0, rotateX: -90 }}
            animate={{ opacity: 1, height: "auto", rotateX: 0 }}
            exit={{ opacity: 0, height: 0, rotateX: -90 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <nav className="flex flex-col space-y-4 mt-6">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    scrollToSection(item.href);
                    setActiveSection(item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left transition-colors text-sm font-medium relative ${
                    activeSection === item.href
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-orange-500"
                  } hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white hover:after:transition-all hover:after:duration-300`}
                  initial={{ opacity: 0, x: -50, rotateY: -90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, rotateY: 5 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
