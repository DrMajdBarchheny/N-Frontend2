"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Trash2, Plus, Minus, FileText, Download, Edit, MessageCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import  {AnimatedBackground}  from "@/components/animated-background"
import Header from "@/components/Header"
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfilePage } from "@/lib/redux/hooks";

// Type definition for request object
interface RequestItem {
  id?: number;
  name?: string;
  company?: string;
  contact?: string;
  eventType?: string;
  eventDate?: string;
  details?: string;
  uploadedFile?: {
    name?: string;
    size?: string;
    uploadDate?: string;
  };
}

// Mock data - in a real app, this would come from your database/API
const userData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  avatar: "/placeholder.svg?height=80&width=80",
  initials: "SJ",
}

const favoriteItems = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Clothing",
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug Set",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Home & Kitchen",
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Accessories",
  },
]

const cartItems = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    quantity: 2,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug Set",
    price: 39.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

// Mock request data - in a real app, this would come from your database/API
const userRequest = {
  name: "Sarah Johnson",
  company: "Tech Solutions Inc.",
  contact: "sarah.johnson@example.com",
  eventType: "Corporate Event",
  eventDate: "2024-03-15",
  details:
    "We're planning a corporate team-building event for approximately 50 employees. The event should include interactive workshops, networking sessions, and a catered lunch. We're looking for a venue that can accommodate both indoor presentations and outdoor activities. The theme should be focused on innovation and collaboration.",
  uploadedFile: {
    name: "event-requirements.pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-10",
  },
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, profile, requests, cart, favorites } = useProfilePage();

  // Fetch additional data on component mount (user data is already in Redux from login)
  useEffect(() => {
    if (user.isAuthenticated && !profile.profile && !profile.loading) {
      // Fetch profile if not loaded
      profile.fetchProfile();
    }
  }, [user.isAuthenticated, profile.profile, profile.loading]);

  useEffect(() => {
    if (user.isAuthenticated && profile.profile?.id) {
      requests.fetchRequests();
      cart.fetchItems();
      favorites.fetchItems();
    }
  }, [user.isAuthenticated, profile.profile?.id]);
  
  const navigation = [
    { name: t("nav.HomePage"), href: "/" },
    { name: t("nav.whatWeDo"), href: "/#what-we-do" },
    { name: t("nav.work"), href: "/our-work" },
    
    // { name: t("nav.team"), href: "#team" },
    // { name: t("nav.clients"), href: "#clients" },
    { name: t("nav.contact"), href: "#footer" },
  ];
  const scrollToSection = (href: string) => {
    window.location.href = href;
  };

  // Get user data from Redux state (already loaded from login)
  const userData = {
    name: profile.profile?.username || "Loading...",
    email: profile.profile?.email || "Loading...",
    avatar: profile.profile?.avatar || "/placeholder.svg?height=80&width=80",
    initials: profile.profile?.username?.split(' ').map((n: string) => n[0]).join('') || "U",
  };

  // Remove currentRequest logic
  // const currentRequest = requests.requests?.[0] || userRequest;

  // Loading states
  const isLoading = requests.loading;
  const isError = requests.error;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1727] via-[#103261] to-[#2c5da3] relative">
      {/* Header */}
      <Header navigation={navigation} scrollToSection={scrollToSection} />
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-40 pb-8 max-w-6xl animate-in fade-in duration-700 relative z-10">
        {/* User Profile Header */}
        <Card className="mb-8 backdrop-blur-sm bg-white/95 shadow-xl border-0 animate-in slide-in-from-top duration-500 hover:shadow-2xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 ring-4 ring-white/20 transition-all duration-300 hover:ring-white/40 hover:scale-105">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-[#ff7849] to-[#ff4500] text-white">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 animate-in slide-in-from-left duration-700 delay-200">
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : (
                    userData.name
                  )}
                </h1>
                <p className="text-gray-600 mt-1 animate-in slide-in-from-left duration-700 delay-300">
                  {userData.email}
                </p>
                {isError && (
                  <p className="text-red-500 text-sm mt-2">
                    Error loading profile data
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List Section */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading requests...
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center py-8">{isError}</div>
        ) : (requests.requests && requests.requests.length > 0 ? (
          requests.requests.map((req: RequestItem, idx: number) => (
            <Card key={req.id || idx} className="mb-8 backdrop-blur-sm bg-white/95 shadow-xl border-0 animate-in slide-in-from-bottom duration-700 delay-400 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500 animate-pulse" />
                      Request #{req.id || idx + 1}
                    </CardTitle>
                    <CardDescription>Details of your submitted request</CardDescription>
                  </div>
                  {/* Pending Review badge removed */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500 delay-600">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {req.name || userData.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Company</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {req.company || <span className="text-gray-400 italic">Not specified</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {req.contact || userData.email}
                      </p>
                    </div>
                  </div>

                  {/* Event Information */}
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500 delay-700">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Event Type</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{req.eventType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Event Date</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {req.eventDate ? new Date(req.eventDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Uploaded File</label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-orange-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{req.uploadedFile?.name || "No file"}</p>
                            <p className="text-xs text-gray-500">
                              {req.uploadedFile?.size ? `${req.uploadedFile.size} • Uploaded ${req.uploadedFile.uploadDate ? new Date(req.uploadedFile.uploadDate).toLocaleDateString() : ''}` : ""}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-right duration-500 delay-800">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Request Details</label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-700 leading-relaxed">{req.details}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {/* Edit Request button removed */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No requests found.</div>
        ))}
        {/* Favorite Items and Cart sections removed as requested */}
      </div>
    </div>
  )
} 