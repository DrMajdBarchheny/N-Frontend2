"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { motion, useMotionValue } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

interface Client {
  id: string
  name: string
  logo: string
}

// Fixed positions for background elements to avoid hydration mismatch


export default function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isRTL } = useLanguage()
  
  // Drag functionality
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get("https://n-backend-gamma.vercel.app/api/clients/")
        setClients(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load clients.")
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    isDragging.current = true
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft
    scrollLeft.current = scrollContainerRef.current.scrollLeft
    scrollContainerRef.current.style.cursor = "grabbing"
    scrollContainerRef.current.style.userSelect = "none"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return
    e.preventDefault()
    const currentX = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (currentX - startX.current) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab"
      scrollContainerRef.current.style.userSelect = "auto"
    }
  }

  const handleMouseLeave = () => {
    isDragging.current = false
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab"
      scrollContainerRef.current.style.userSelect = "auto"
    }
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    isDragging.current = true
    startX.current = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    scrollLeft.current = scrollContainerRef.current.scrollLeft
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return
    e.preventDefault()
    const currentX = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (currentX - startX.current) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleTouchEnd = () => {
    isDragging.current = false
  }

  return (
    <motion.section 
      className="py-16 relative bg-slate-50 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Section Content - Always animated regardless of loading state */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        {loading && (
          <div className="text-center py-8">
            Loading clients...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <motion.div
              className="flex space-x-12 items-center min-w-max"
              style={{ x }}
              animate={!isDragging.current ? {
                x: isRTL ? [0, 1000] : [0, -1000],
              } : {}}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* First set of logos */}
              {clients.map((client) => (
                <div key={client.id} className="flex-shrink-0 mx-6 select-none">
                  <Image
                    src={`https://n-backend-gamma.vercel.app${client.logo}`}
                    alt={client.name || "Client logo"}
                    width={180}
                    height={90}
                    className="h-24 w-auto max-h-28 max-w-[180px] object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {clients.map((client) => (
                <div key={`${client.id}-duplicate`} className="flex-shrink-0 mx-6 select-none">
                  <Image
                    src={`https://n-backend-gamma.vercel.app${client.logo}`}
                    alt={client.name || "Client logo"}
                    width={180}
                    height={90}
                    className="h-24 w-auto max-h-28 max-w-[180px] object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.section>
  )
}
