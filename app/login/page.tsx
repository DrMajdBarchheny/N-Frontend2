"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"

import Header from "@/components/Header"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser, handleGoogleLoginData } from "@/lib/redux/actions";

const BACKGROUND_ELEMENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i * 20 + 10) % 100,
  top: (i * 25 + 15) % 100,
  delay: i * 0.2,
  duration: 4 + (i % 2),
}));

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
 
 
  const router = useRouter();
  const dispatch = useDispatch();


  useEffect(() => {
    setIsVisible(true)
    setIsMounted(true)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = t("login.error.emailRequired")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("login.error.invalidEmail")
    }

    if (!formData.password) {
      newErrors.password = t("login.error.passwordRequired")
    } else if (formData.password.length < 6) {
      newErrors.password = t("login.error.passwordShort")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(formData.email, formData.password) as any);
      if (result.success) {
        router.push("/"); // or your protected route
      } else {
        setErrors({ ...errors, general: t("login.error.invalidCredentials") });
      }
    } catch (err) {
      // Handle error (show message, etc.)
      setErrors({ ...errors, general: t("login.error.invalidCredentials") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGoogleLoading(false)
    console.log("Google sign-in successful")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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
    <div>

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

        <div className={`relative z-10 w-full max-w-md transition-all duration-1000 ${isVisible ? "animate-slide-in-up opacity-100" : "opacity-0 translate-y-8"}`}>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("login.backToHome")}
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent mb-2">
                {t("login.title")}
              </h1>
              <p className="text-slate-300">{t("login.subtitle")}</p>
            </div>

            <Button
              onClick={()=> login()}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGoogleLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("login.googleLoading")}
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {t("login.google")}
                </div>
              )}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/50 text-slate-400">{t("login.orEmail")}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">{t("login.emailLabel")}</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder={t("login.emailPlaceholder")}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">{t("login.passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 pr-12 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder={t("login.passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor="remember" className={`text-slate-300 text-sm ${isRTL ? "mr-4" : "ml-4"}`}>{t("login.rememberMe")}</Label>
                </div>
                <Link href="/forgot-password" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                  {t("login.forgotPassword")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("login.loading")}
                  </div>
                ) : (
                  t("login.submit")
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-300">
                {t("login.noAccount") + " "}
                <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  {t("login.registerLink")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 