"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

interface ProjectImage {
  id: number
  url: string
  title: string
  description: string
}

interface ProjectDisplayProps {
  selectedProject: {
    id: string
    title: string
    category: string
    description: string
    image: string
    images: ProjectImage[]
  } | null
  onClose: () => void
}

export default function ProjectDisplay({ selectedProject, onClose }: ProjectDisplayProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const { t, isRTL } = useLanguage();

  // Auto-play functionality
  React.useEffect(() => {
    if (!selectedProject || !isPlaying) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedProject.images.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [selectedProject, isPlaying])

  // Reset current image index when project changes
  React.useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedProject])

  if (!selectedProject) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl lg:text-6xl font-bold mb-6 text-white"
              whileHover={{ scale: 1.02 }}
            >
              {t("projectDisplay.project")}
              <motion.span className="block text-orange-400" whileHover={{ scale: 1.05 }}>
                {t("projectDisplay.gallery")}
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              whileHover={{ scale: 1.01 }}
            >
              {t("projectDisplay.clickToView")}
            </motion.p>
          </motion.div>
        </div>
      </section>
    )
  }

  const images = selectedProject.images

  const goToPrevious = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)
  }

  const goToNext = () => {
    setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        {/* Project Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1">
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-white mb-2"
              whileHover={{ scale: 1.02 }}
            >
              {selectedProject.title}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300"
              whileHover={{ scale: 1.01 }}
            >
              {selectedProject.description}
            </motion.p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-2" />
              {t("common.close")}
            </Button>
          </motion.div>
        </motion.div>

        {/* Image Display */}
        <motion.div
          className="relative bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden h-[400px] lg:h-[580px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].title}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          {/* Image Info */}
          

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-white text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                key={currentImageIndex}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
} 