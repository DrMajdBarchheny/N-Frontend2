"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";

// Fixed positions for background elements to avoid hydration mismatch
const BACKGROUND_ELEMENTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: (i * 17.3 + 5) % 100, // Deterministic positioning
  top: (i * 23.7 + 10) % 100,
  delay: i * 0.1,
  duration: 3 + (i % 3),
}));

// Define the type for team member
interface TeamMember {
  id: number;
  translations: {
    en: {
      name: string;
      title: string;
      bio: string;
    };
    ar: {
      name: string;
      title: string;
      bio: string;
    };
  };
  photo: string;
}

// Mock data for fallback when API fails
const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    translations: {
      en: {
        name: "John Smith",
        title: "CEO & Founder",
        bio: "Experienced leader with 15+ years in the industry",
      },
      ar: {
        name: "جون سميث",
        title: "الرئيس التنفيذي والمؤسس",
        bio: "قائد ذو خبرة لأكثر من 15 عاماً في المجال",
      },
    },
    photo: "",
  },
  {
    id: 2,
    translations: {
      en: {
        name: "Sarah Johnson",
        title: "Creative Director",
        bio: "Award-winning designer with passion for innovation",
      },
      ar: {
        name: "سارة جونسون",
        title: "المدير الإبداعي",
        bio: "مصممة حائزة على جوائز مع شغف بالابتكار",
      },
    },
    photo: "/placeholder.svg",
  },
  {
    id: 3,
    translations: {
      en: {
        name: "Michael Chen",
        title: "Technical Lead",
        bio: "Expert in cutting-edge technologies and solutions",
      },
      ar: {
        name: "مايكل تشين",
        title: "قائد تقني",
        bio: "خبير في أحدث التقنيات والحلول",
      },
    },
    photo: "/placeholder.svg",
  },
  {
    id: 4,
    translations: {
      en: {
        name: "Emily Davis",
        title: "Project Manager",
        bio: "Dedicated professional ensuring project success",
      },
      ar: {
        name: "إيميلي ديفيس",
        title: "مدير المشاريع",
        bio: "محترفة متخصصة في ضمان نجاح المشاريع",
      },
    },
    photo: "/placeholder.svg",
  },
];

// SkeletonCard component for loading state
function SkeletonCard() {
  return (
    <div className="animate-pulse group text-center bg-gray-800/20 rounded-3xl p-6 shadow-2xl border border-gray-700/50">
      {/* Circular Image Skeleton */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-full border-4 border-[#E97B00] bg-gray-700 mb-4 shadow-2xl" />
      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-2/3 bg-gray-700 rounded mx-auto" />
        <div className="h-4 w-1/2 bg-gray-700 rounded mx-auto" />
      </div>
    </div>
  );
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { language, t } = useLanguage();

  const firstRow = teamMembers.slice(0, 3);
  const secondRow = teamMembers.slice(3, 7);
  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const getTeam = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://n-backend-gamma.vercel.app/api/team/", {
          headers: {
            "Accept-Language": language,
          },
        });
        
        setTeamMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team members:", error);
        console.log("Using mock data as fallback");
        setTeamMembers(mockTeamMembers);
        setLoading(false);
      }
    };

    getTeam();
  }, [language]);

  if (loading)
    return (
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Animated background elements - Only render on client */}
        {isMounted && (
          <div className="absolute inset-0">
            {BACKGROUND_ELEMENTS.map((element) => (
              <motion.div
                key={element.id}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${element.left}%`,
                  top: `${element.top}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  rotateZ: [0, 360],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: element.delay,
                }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-white tracking-widest uppercase">
              <span className="inline text-[#E97B00] mr-4">Loading</span> Team
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 mb-8 sm:mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  return (
    <section className="py-16 sm:py-24 lg:py-8 relative overflow-hidden">
      {/* Animated background elements - Only render on client */}
      {isMounted && (
        <div className="absolute inset-0">
          {BACKGROUND_ELEMENTS.map((element) => (
            <motion.div
              key={element.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                rotateZ: [0, 360],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: element.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30, rotateX: -45 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.p
            className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-8 mt-8 text-center w-full relative z-10"
            initial={{ opacity: 0, y: 100, scale: 2 }}
            whileInView={{ 
              opacity: [0, 1, 1], 
              y: [100, 0, 0], 
              scale: [2, 2, 1] 
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 2.0, 
              delay: 0.5, 
              ease: "easeOut",
              times: [0, 0.4, 1] // 40% of time to slide up, 60% to shrink
            }}
            whileHover={{ rotateX: 10, scale: 1.05 }}
          >
            <motion.span
              className="inline text-[#E97B00] mr-4"
              whileHover={{ rotateX: 15, rotateY: -10 }}
            >
              {t("team.subtitle")}
            </motion.span>
            {t("team.subtitle2")}
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <div className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 lg:mx-auto lg:w-fit">
            {firstRow.map((member, index) => (
              <div
                key={member.id}
                className={`
                  flex flex-col items-center -mx-2
                  ${index === 0 ? 'col-span-2 lg:col-span-1' : ''}
                `}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 2.5 + (index * 0.2) }}
                  className="relative border-4 border-[#E97B00] rounded-[2rem] sm:rounded-[4rem] aspect-square w-full max-w-[300px] lg:min-w-[300px] p-1 mb-4"
                >
                  <div className="group relative w-full h-full aspect-square flex flex-col justify-end items-center text-center rounded-[1.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden">
                    <Image
                      src={`https://n-backend-gamma.vercel.app${member.photo}` || "/placeholder.svg"}
                      alt={member.translations[language].name}
                      fill
                      className="object-cover w-full h-full rounded-[1.5rem] sm:rounded-[3.5rem]"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  </div>
                </motion.div>
                <motion.div 
                  className="relative w-full lg:max-w-[300px] flex flex-col items-center px-4 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 3.0 + (index * 0.2) }}
                >
                  <div
                    className="
                      bg-white/10 backdrop-blur-lg border border-white/20 rounded-[1.5rem]
                      px-4 py-2 sm:py-2 w-full shadow-lg 
                      flex flex-col items-center
                      overflow-hidden
                      transition-all duration-1000
                      max-h-12 group-hover:max-h-40 
                    "
                    style={{ minHeight: "2.5rem" }}
                  >
                    <h3 className="text-xs sm:text-lg mt-0.5 sm:mt-0 font-extrabold text-white drop-shadow text-center">
                      {member.translations[language].name}
                    </h3>
                    <span className="text-xs font-semibold uppercase mx-2 text-[#E97B00] mb-1 text-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {member.translations[language].title}
                    </span>
                    <div className="w-8 h-0.5 bg-[#E97B00] mx-auto mb-2 rounded-full opacity-0 -translate-y-2 group-hover:opacity-60 group-hover:translate-y-0 transition-all duration-500" />
                    <p className="text-gray-300 text-xs leading-relaxed text-center line-clamp-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {member.translations[language].bio}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 justify-center">
            {secondRow.map((member, index) => (
              <div key={member.id} className="flex flex-col items-center -mx-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 3 + (index * 0.2) }}
                  className="relative border-4 border-[#E97B00] rounded-[2rem] sm:rounded-[4rem] aspect-square w-full max-w-[350px] p-1 mb-4"
                >
                  <div className="group relative  w-full h-full aspect-square flex flex-col justify-end items-center text-center rounded-[1.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden">
                    {/* Full Card Image Background */}
                    <Image
                      src={
                        `https://n-backend-gamma.vercel.app${member.photo}` ||
                        "/placeholder.svg"
                      }
                      alt={member.translations[language].name}
                      fill
                      className="object-cover w-full h-full rounded-[1.5rem] sm:rounded-[3.5rem]"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  </div>
                </motion.div>
                {/* Team Member Info Below Card */}
                <motion.div 
                  className="relative w-full flex flex-col items-center px-4 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 2.0 + (index * 0.2) }}
                >
                  <div
                    className="
                      bg-white/10 backdrop-blur-lg border border-white/20 rounded-[1.5rem]
                      px-4 py-2 sm:py-2 w-full shadow-lg 
                      flex flex-col items-center
                      overflow-hidden
                      transition-all duration-1000
                      max-h-12 group-hover:max-h-40 
                    "
                    style={{ minHeight: "2.5rem" }} // Ensures the name is always visible
                  >
                    <h3 className="text-xs sm:text-lg mt-0.5 sm:mt-0 font-extrabold text-white drop-shadow text-center">
                      {member.translations[language].name}
                    </h3>
                    <span className="text-xs font-semibold uppercase mx-2 text-[#E97B00] mb-1 text-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {member.translations[language].title}
                    </span>
                    <div className="w-8 h-0.5 bg-[#E97B00] mx-auto mb-2 rounded-full opacity-0 -translate-y-2 group-hover:opacity-60 group-hover:translate-y-0 transition-all duration-500" />
                    <p className="text-gray-300 text-xs leading-relaxed text-center line-clamp-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      {member.translations[language].bio}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
