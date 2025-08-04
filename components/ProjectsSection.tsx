"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building, Palette, Calendar } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import axios from "axios"

interface ProjectImage {
  id: number
  image: string
  project: number
}

interface ProjectCategory {
  id: number
  translations: {
    en: {
      name: string
    }
    ar?: {
      name: string
    }
  }
}

interface Project {
  id: number
  translations: {
    en: {
      title: string
      description: string
    }
    ar: {
      title: string
      description: string
    }
  }
  category: ProjectCategory
  created_at: string
  images: ProjectImage[]
}

interface TransformedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  images: {
    id: number;
    url: string;
    title: string;
    description: string;
  }[];
}

interface ProjectsSectionProps {
  onProjectSelect: (project: TransformedProject) => void
}

export default function ProjectsSection({ onProjectSelect }: ProjectsSectionProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, isRTL, language } = useLanguage();

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://n-backend-gamma.vercel.app/api/projects/');
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to get translated content
  const getTranslatedContent = (translations: any, field: string) => {
    if (!translations) return '';
    return translations[language]?.[field] || translations.en?.[field] || '';
  };

  // Helper function to get project image URL
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://n-backend-gamma.vercel.app${imagePath}`;
  };

  // Transform API data to match our component structure
  const transformedProjects = projects.map(project => ({
    id: project.id.toString(),
    title: getTranslatedContent(project.translations, 'title'),
    category: getTranslatedContent(project.category.translations, 'name'),
    description: getTranslatedContent(project.translations, 'description'),
    image: project.images.length > 0 ? getImageUrl(project.images[0].image) : '',
    images: project.images.map((img, index) => ({
      id: img.id,
      url: getImageUrl(img.image),
      title: getTranslatedContent(project.translations, 'title'),
      description: getTranslatedContent(project.translations, 'description')
    }))
  }));

  // Group projects by category
  const categories = [
    {
      id: "exhibitions",
      title: t("projectsSection.exhibition"),
      icon: Building,
      color: "from-blue-500 to-blue-600",
      projects: transformedProjects.filter(p => 
        p.category.toLowerCase().includes('exhibition') || 
        p.category.toLowerCase().includes('معرض')
      )
    },
    {
      id: "interior",
      title: t("projectsSection.interior"),
      icon: Palette,
      color: "from-purple-500 to-purple-600",
      projects: transformedProjects.filter(p => 
        p.category.toLowerCase().includes('interior') || 
        p.category.toLowerCase().includes('داخلي')
      )
    },
    {
      id: "booth",
      title: t("projectsSection.booth"),
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
      projects: transformedProjects.filter(p => 
        p.category.toLowerCase().includes('booth') || 
        p.category.toLowerCase().includes('جناح')
      )
    },
    {
      id: "management",
      title: t("projectsSection.management"),
      icon: Building,
      color: "from-amber-500 to-orange-600",
      projects: transformedProjects.filter(p => 
        p.category.toLowerCase().includes('management') || 
        p.category.toLowerCase().includes('إدارة')
      )
    }
  ];

  if (loading) {
    return (
      <section className="py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E97B00] mx-auto"></div>
            <p className="text-gray-300 mt-4">{t("common.loading")}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl lg:text-4xl font-bold mb-6 text-[#E97B00] "
            whileHover={{ scale: 1.02 }}
          >
            {t("projectsSection.our")}{" "}
            <motion.span className="text-white" whileHover={{ scale: 1.05 }}>
              {t("projectsSection.projects")}
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            whileHover={{ scale: 1.01 }}
          >
            {t("projectsSection.subtitle")}
          </motion.p>
        </motion.div>

        <div className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const expanded = expandedSections[category.id] || false;
            const showToggle = category.projects.length > 2;
            const visibleProjects = expanded ? category.projects : category.projects.slice(0, 2);
            
            // Skip categories with no projects
            if (category.projects.length === 0) return null;
            
            return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            >
              {/* Category Header */}
              <motion.div
                className="flex items-center mb-8"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}
                  whileHover={{ rotateY: 180, scale: 1.1 }}
                >
                  <category.icon className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">{category.title}</h3>
                  <p className="text-gray-300">{category.projects.length} {t("projectsSection.projectsLabel")}</p>
                </div>
              </motion.div>

              {/* Projects Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {visibleProjects.map((project, projectIndex) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30, rotateY: projectIndex % 2 === 0 ? -45 : 45 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: projectIndex * 0.2 }}
                    className="group cursor-pointer"
                    onClick={() => onProjectSelect(project)}
                    whileHover={{
                      rotateX: 5,
                      rotateY: projectIndex % 2 === 0 ? 5 : -5,
                      scale: 1.02,
                    }}
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-2xl mb-6"
                      whileHover={{
                        rotateX: 10,
                        rotateY: projectIndex % 2 === 0 ? 5 : -5,
                        scale: 1.02,
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={700}
                        height={500}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div
                        className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100"
                        initial={{ y: 20 }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                            {t("projectsSection.viewGallery")}
                            <motion.div whileHover={{ x: 5, rotateZ: 15 }}>
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 mb-3">{project.category}</Badge>
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      {project.title}
                    </motion.h3>
                    <motion.p className="text-gray-300 leading-relaxed" whileHover={{ scale: 1.01 }}>
                      {project.description}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
                {showToggle && (
                  <div className="flex justify-center mt-6">
                    <Button
                      className="bg-[#E97B00] text-white border-[#E97B00] hover:bg-[#B85C00] hover:border-[#B85C00]"
                      onClick={() => setExpandedSections(prev => ({ ...prev, [category.id]: !expanded }))}
                    >
                      {expanded ? t("projectsSection.showLess") : t("projectsSection.showMore")}
                    </Button>
                  </div>
                )}
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
} 