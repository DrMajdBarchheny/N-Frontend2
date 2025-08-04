"use client"

import { useLanguage } from "@/contexts/LanguageContext"

interface RTLWrapperProps {
  children: React.ReactNode
}

export default function RTLWrapper({ children }: RTLWrapperProps) {
  const { isRTL } = useLanguage()
  
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "rtl" : "ltr"}>
      {children}
    </div>
  )
} 