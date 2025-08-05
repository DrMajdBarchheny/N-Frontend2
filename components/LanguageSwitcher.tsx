"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage()
  console.log("this is the language in header",language)
  return (
    <motion.div
      className="flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Globe className={`h-4 w-4 text-gray-300 ${language === 'ar' ? 'mx-1.5' : ''}`} />
      <div className="flex bg-gray-800 rounded-lg p-1">
        <motion.button
          onClick={() => setLanguage("en")}
          className={`px-2 py-0.5 text-sm font-medium rounded-md transition-all ${
            language === "en" ? "bg-[#E97B00] text-white" : "text-gray-300 hover:text-white"
          }`}
          
          whileTap={{ scale: 0.95 }}
        >
          EN
        </motion.button>
        <motion.button
          onClick={() => setLanguage("ar")}
          className={`px-2 py-0.5 text-sm font-medium rounded-md transition-all ${
            language === "ar" ? "bg-[#E97B00] text-white" : "text-gray-300 hover:text-white"
          }`}
          
          whileTap={{ scale: 0.95 }}
        >
          
          عربي
        </motion.button>
      </div>
    </motion.div>
  )
}
