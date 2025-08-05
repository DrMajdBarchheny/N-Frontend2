"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, Loader2, Check, X } from "lucide-react"

import Header from "@/components/Header"
import { useLanguage } from "@/contexts/LanguageContext";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { handleGoogleLoginData } from "@/lib/redux/actions";

const BACKGROUND_ELEMENTS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: Math.random() * 90 + 5, // Random between 5% and 95%
  top: Math.random() * 90 + 5, // Random between 5% and 95%
  delay: i * 0.2,
  duration: 4 + (i % 2),
}));

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsVisible(true)
    setIsMounted(true)
  }, [])

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username) {
      newErrors.username = t("register.error.usernameRequired")
    } else if (formData.username.length < 3) {
      newErrors.username = t("register.error.usernameShort")
    }

    if (!formData.email) {
      newErrors.email = t("register.error.emailRequired")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("register.error.invalidEmail")
    }

    if (!formData.password) {
      newErrors.password = t("register.error.passwordRequired")
    } else if (formData.password.length < 8) {
      newErrors.password = t("register.error.passwordShort")
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("register.error.confirmPasswordRequired")
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("register.error.passwordsNoMatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const res = await axios.post('https://n-backend-gamma.vercel.app/api/auth/registration/', {
        username: formData.username,
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword,
      });
      
      // Store token and user data in Redux
      dispatch(handleGoogleLoginData(res.data.key, res.data.user) as any);
      router.push("/"); // or your protected route
    } catch (err) {
      // Handle error (show message, etc.)
      setErrors({ ...errors, general: t("register.error.failed") });
    } finally {
      setIsLoading(false);
    }
  };



  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500"
    if (strength <= 3) return "bg-orange-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        // Send the access token to your Django backend
        const res = await axios.post('https://n-backend-gamma.vercel.app/api/auth/social/login/', {
          access_token: tokenResponse.access_token,
          provider: "google"
        });
        // Handle backend response (store token, redirect, etc.)
        console.log('Backend response:', res.data);
        // Store the token and user data in Redux
        dispatch(handleGoogleLoginData(res.data.key, res.data.user) as any);
        // Redirect the user
        router.push("/"); // or "/dashboard" or any protected route
      } catch (err) {
        // Handle error
        console.error(err);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setIsGoogleLoading(false);
      // Handle error
    },
  });


  const { t, isRTL } = useLanguage();

  const navigation = [
    { name: t("nav.HomePage"), href: "/" },
    { name: t("nav.whatWeDo"), href: "/#what-we-do" },
    { name: t("nav.work"), href: "/our-work" },
    
    // { name: t("nav.team"), href: "#team" },
    // { name: t("nav.clients"), href: "#clients" },
    { name: t("nav.contact"), href: "/#footer" },
  ];
  const scrollToSection = (href: string) => {
    window.location.href = href;
  };

  return (
    <>
      <Header navigation={navigation} scrollToSection={scrollToSection} />
      <div className="min-h-screen bg-gradient-to-br from-[#0b1727] via-[#103261] to-[#2c5da3] flex items-center justify-center p-4 pt-36">

      {/* Background dots - same as hero section */}
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

      <div
        className={`relative z-10 w-full max-w-md transition-all duration-1000 ${isVisible ? "animate-slide-in-up opacity-100" : "opacity-0 translate-y-8"}`}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("register.backToHome")}
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-500 bg-clip-text text-transparent mb-2">
              {t("register.title")}
            </h1>
            <p className="text-slate-300">{t("register.subtitle")}</p>
          </div>

          {/* Google Sign-Up Button */}
          <Button
            onClick={()=> login()}
            disabled={isGoogleLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t("register.googleLoading")}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("register.google")}
              </>
            )}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/50 text-slate-400">{t("register.orEmail")}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white font-medium">
                {t("register.usernameLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 ${errors.username ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder={t("register.usernamePlaceholder")}
                />
                {formData.username && !errors.username && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
                {errors.username && <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.username}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                {t("register.emailLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder={t("register.emailPlaceholder")}
                />
                {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
                {errors.email && <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                {t("register.passwordLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 pr-12 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder={t("register.passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium">
                {t("register.confirmPasswordLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 pr-12 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder={t("register.confirmPasswordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordStrength" className="text-white font-medium">
                {t("register.passwordStrength")}
              </Label>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${getStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-slate-400 text-sm">{
                passwordStrength <= 2 ? t("register.weak") :
                passwordStrength <= 3 ? t("register.medium") :
                t("register.strong")
              }</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("register.googleLoading")}
                </>
              ) : (
                t("register.submit")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
} 
