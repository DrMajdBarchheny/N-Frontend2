import { Award, Star, Users, Zap, Building, Palette, Calendar } from "lucide-react"
import type { NavigationItem, Stat, Service } from "./types"

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "EXHIBITION DESIGN", href: "#exhibition" },
  { name: "OUR WORK", href: "#work" },
  { name: "3D MODELS", href: "#models" },
  { name: "RENTAL CATALOG", href: "#rental" },
  { name: "OUR TEAM", href: "#team" },
  { name: "CLIENTS", href: "#clients" },
  { name: "CONTACT", href: "#contact" },
]

export const STATS: Stat[] = [
  { number: "500+", label: "Projects Completed", icon: Award },
  { number: "18", label: "Years Experience", icon: Star },
  { number: "200+", label: "Happy Clients", icon: Users },
  { number: "50+", label: "Team Members", icon: Zap },
]

export const SERVICES: Service[] = [
  {
    icon: Building,
    title: "Exhibition Design",
    description: "Custom exhibition stands that captivate and engage your audience with innovative spatial design.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Palette,
    title: "Interior Fit-Out",
    description: "Complete interior solutions for commercial and retail spaces that reflect your brand identity.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "End-to-end event planning and execution services for memorable brand experiences.",
    color: "from-purple-500 to-purple-600",
  },
]

export const SPRING_CONFIG = {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
}
