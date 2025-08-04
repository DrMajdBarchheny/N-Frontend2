"use client"

import { useScroll, useTransform, useSpring } from "framer-motion"
import { SPRING_CONFIG } from "../constants"

export function useScrollAnimation() {
  const { scrollY } = useScroll()

  const heroY = useSpring(useTransform(scrollY, [0, 500], [0, -150]), SPRING_CONFIG)
  const heroScale = useSpring(useTransform(scrollY, [0, 500], [1, 1.1]), SPRING_CONFIG)
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95])

  return {
    scrollY,
    heroY,
    heroScale,
    headerOpacity,
  }
}
