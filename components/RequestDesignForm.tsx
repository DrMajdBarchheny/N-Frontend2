"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js"
// @ts-ignore
import { getCountryFlag } from "country-flag-emoji"
import emailjs from '@emailjs/browser'
import { emailConfig, createEmailParams } from '@/lib/emailConfig'
import {
  X,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import axios from 'axios'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './phone-input-custom.css'

interface FormData {
  name: string
  company: string
  phone: string
  email: string
  eventType: string
  eventDate: string
  description: string
}

interface FormErrors {
  [key: string]: string
}

interface PhoneInfo {
  country: string
  countryCode: string
  nationalNumber: string
  isValid: boolean
  error?: string
}

interface RequestDesignFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestDesignForm({ isOpen, onClose }: RequestDesignFormProps) {
  const { t, isRTL } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [isOpen])

  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    description: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [phoneInfo, setPhoneInfo] = useState<PhoneInfo | null>(null)

  // Get country flag emoji using the country-flag-emoji library
  const getCountryFlagEmoji = (countryCode: string): string => {
    try {
      return getCountryFlag(countryCode) || '🌍'
    } catch {
      return '🌍'
    }
  }

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [isOpen])

  const eventTypes = [
    "eventTypes.exhibition",
    "eventTypes.conference",
    "eventTypes.tradeShow",
    "eventTypes.corporate",
    "eventTypes.retail",
    "eventTypes.museum",
    "eventTypes.showroom",
    "eventTypes.other",
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("common.required")
    }

    if (!formData.company.trim()) {
      newErrors.company = t("common.required")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("common.required")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("common.required")
    } else {
      // Enhanced phone number validation with country detection
      const phoneValidation = validatePhoneNumber(formData.phone)
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error || "Invalid phone number"
      }
      // Store phone info for display
      setPhoneInfo(phoneValidation.isValid ? phoneValidation : null)
    }

    if (!formData.eventType) {
      newErrors.eventType = t("common.required")
    }

    if (!formData.eventDate) {
      newErrors.eventDate = t("common.required")
    }

    if (!formData.description.trim()) {
      newErrors.description = t("common.required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Enhanced phone number validation function with country detection
  // This function detects fake phone numbers and identifies the country
  const validatePhoneNumber = (phone: string): PhoneInfo => {
    // Remove all non-digit characters for basic validation
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Check if it's empty after cleaning
    if (cleanPhone.length === 0) {
      return {
        country: "",
        countryCode: "",
        nationalNumber: "",
        isValid: false,
        error: "Phone number must contain digits"
      }
    }

    // Check for minimum length (most countries have at least 7 digits)
    if (cleanPhone.length < 7) {
      return {
        country: "",
        countryCode: "",
        nationalNumber: "",
        isValid: false,
        error: "Phone number is too short"
      }
    }

    // Check for maximum length (most countries have max 15 digits)
    if (cleanPhone.length > 15) {
      return {
        country: "",
        countryCode: "",
        nationalNumber: "",
        isValid: false,
        error: "Phone number is too long"
      }
    }

    // Detect common fake number patterns
    const fakePatterns = [
      // All same digits (e.g., 1111111111, 2222222222)
      /^(\d)\1{6,}$/,
      // Sequential digits (e.g., 1234567890, 9876543210)
      /^1234567890$/,
      /^0987654321$/,
      /^0123456789$/,
      // Repeated patterns (e.g., 1212121212, 1231231231)
      /^(\d{2,3})\1{3,}$/,
      // All zeros
      /^0+$/,
      // Test numbers (common patterns)
      /^555\d{7}$/, // US test numbers
      /^999\d{7}$/, // UK test numbers
      /^000\d{7}$/, // Common fake pattern
    ]

    for (const pattern of fakePatterns) {
      if (pattern.test(cleanPhone)) {
        return {
          country: "",
          countryCode: "",
          nationalNumber: "",
          isValid: false,
          error: "This appears to be a fake or test phone number"
        }
      }
    }

    // Try to parse the phone number with libphonenumber-js
    try {
      const parsedNumber = parsePhoneNumber(phone)
      
      if (parsedNumber && parsedNumber.isValid()) {
        return {
          country: parsedNumber.country || "Unknown",
          countryCode: parsedNumber.countryCallingCode || "",
          nationalNumber: parsedNumber.nationalNumber || "",
          isValid: true,
          error: ""
        }
      } else {
        // If libphonenumber can't parse it, fall back to basic validation
        if (cleanPhone.length >= 8 && cleanPhone.length <= 15) {
          // Additional check: ensure it's not all the same digit
          if (!/^(\d)\1{7,}$/.test(cleanPhone)) {
            return {
              country: "Unknown",
              countryCode: "",
              nationalNumber: cleanPhone,
              isValid: true,
              error: ""
            }
          }
        }
        
        return {
          country: "",
          countryCode: "",
          nationalNumber: "",
          isValid: false,
          error: "Invalid phone number format"
        }
      }
    } catch (error) {
      // If parsing fails, fall back to basic validation
      if (cleanPhone.length >= 8 && cleanPhone.length <= 15) {
        if (!/^(\d)\1{7,}$/.test(cleanPhone)) {
          return {
            country: "Unknown",
            countryCode: "",
            nationalNumber: cleanPhone,
            isValid: true,
            error: ""
          }
        }
      }
      
      return {
        country: "",
        countryCode: "",
        nationalNumber: "",
        isValid: false,
        error: "Invalid phone number format"
      }
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    
    // Real-time phone number validation with country detection
    if (field === "phone" && value.trim()) {
      const phoneValidation = validatePhoneNumber(value)
      if (!phoneValidation.isValid) {
        setErrors((prev) => ({ ...prev, phone: phoneValidation.error || "Invalid phone number" }))
        setPhoneInfo(null)
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }))
        setPhoneInfo(phoneValidation)
      }
    } else if (field === "phone" && !value.trim()) {
      setPhoneInfo(null)
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setSubmitStatus("error");
      setErrors(prev => ({ ...prev, form: "You must be logged in to submit a request." }));
      return;
    }

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // --- SEND TO BACKEND ---
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      // Choose what to use for contact (e.g., phone or email)
      formDataToSend.append('contact', formData.phone || formData.email || '');
      // Use backend field names
      formDataToSend.append('event_type', formData.eventType);
      formDataToSend.append('event_date', formData.eventDate);
      formDataToSend.append('details', formData.description);
      if (phoneInfo) {
        formDataToSend.append('phone_country', phoneInfo.country);
        formDataToSend.append('phone_country_code', phoneInfo.countryCode);
      }

      // Get auth token if present
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      await axios.post('https://n-backend-gamma.vercel.app/api/design-request/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { 'Authorization': `Token ${token}` } : {}),
        },
      })

      // --- SEND EMAIL (EmailJS) ---
      const templateParams = createEmailParams(formData, phoneInfo)
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      )

      setSubmitStatus("success")
      setTimeout(() => {
        setFormData({
          name: "",
          company: "",
          phone: "",
          email: "",
          eventType: "",
          eventDate: "",
          description: "",
        })
        setPhoneInfo(null)
        onClose()
        setSubmitStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Submission failed:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }



  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-36"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={scrollContainerRef}
        className="w-full max-w-4xl max-h-[78vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.p
                  className="text-orange-400 text-sm font-medium tracking-widest uppercase mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {t("requestDesign.subtitle")}
                </motion.p>
                <motion.h2
                  className="text-3xl lg:text-4xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t("requestDesign.title")}
                </motion.h2>
                <motion.p
                  className="text-gray-300 mt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t("requestDesign.description")}
                </motion.p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === "success" && (
              <motion.div
                className="mb-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-green-400">{t("requestDesign.success")}</p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                className="mb-6 p-4 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-400">{t("requestDesign.error")}</p>
              </motion.div>
            )}

            {!isAuthenticated && (
              <div className="text-red-400 text-sm mb-4">
                You must be logged in to submit a request.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <label className="block text-sm font-medium text-white mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    {t("requestDesign.name")} <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("requestDesign.namePlaceholder")}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    {t("requestDesign.company")} <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder={t("requestDesign.companyPlaceholder")}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.company ? "border-red-500" : ""}`}
                  />
                  {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company}</p>}
                </motion.div>
              </div>

              {/* Contact Information */}
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {t("requestDesign.phone")} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <PhoneInput
                      country={'us'}
                      value={formData.phone}
                      onChange={(value, country, e, formattedValue) => {
                        handleInputChange("phone", value)
                      }}
                      inputClass="phone-input-custom"
                      buttonClass="bg-gray-800 border-gray-600"
                      dropdownClass="bg-gray-900 text-white"
                      enableSearch
                      disableDropdown={false}
                      masks={{us: '(...) ...-....'}}
                      // ...other props as needed
                    />
                    {/* You can keep your validation icons and messages below */}
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  {phoneInfo?.isValid && (
                    <div className="mt-2 p-2 bg-green-600/10 border border-green-600/20 rounded-md">
                      <div className="flex items-center text-green-400 text-sm">
                        <span className="text-lg mr-2">
                          {phoneInfo.country !== "Unknown" ? getCountryFlagEmoji(phoneInfo.country) : "🌍"}
                        </span>
                        <span className="font-medium">
                          {phoneInfo.country === "Unknown" ? "Valid phone number" : phoneInfo.country}
                        </span>
                        {phoneInfo.countryCode && (
                          <span className="ml-2 text-xs text-green-300">
                            (+{phoneInfo.countryCode})
                          </span>
                        )}
                      </div>
                      {phoneInfo.nationalNumber && phoneInfo.country !== "Unknown" && (
                        <p className="text-xs text-green-300 mt-1">
                          National: {phoneInfo.nationalNumber}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    We validate phone numbers to prevent fake submissions. Include country code for international numbers.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    {t("requestDesign.email")} <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("requestDesign.emailPlaceholder")}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </motion.div>
              </div>

              {/* Event Details */}
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    {t("requestDesign.eventType")} <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => handleInputChange("eventType", e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.eventType ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">{t("requestDesign.eventTypePlaceholder")}</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {t(type)}
                      </option>
                    ))}
                  </select>
                  {errors.eventType && <p className="text-red-400 text-sm mt-1">{errors.eventType}</p>}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    {t("requestDesign.eventDate")} <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange("eventDate", e.target.value)}
                    className={`bg-gray-800 border-gray-600 text-white ${errors.eventDate ? "border-red-500" : ""}`}
                  />
                  {errors.eventDate && <p className="text-red-400 text-sm mt-1">{errors.eventDate}</p>}
                </motion.div>
              </div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                <label className="block text-sm font-medium text-white mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  {t("requestDesign.description")} <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={t("requestDesign.descriptionPlaceholder")}
                  rows={4}
                  className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </motion.div>



              {/* Submit Button */}
              <motion.div
                className="flex flex-col space-y-4 sm:flex-row sm:justify-start sm:space-y-0 sm:space-x-2 pt-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white w-full sm:w-auto sm:mx-2"
                >
                  {t("common.cancel")}
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-auto">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 w-full sm:w-auto "
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t("requestDesign.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {t("requestDesign.submit")}
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
