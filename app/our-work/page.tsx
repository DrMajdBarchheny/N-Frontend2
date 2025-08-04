"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectDisplay from "@/components/ProjectDisplay";
import ProjectsSection from "@/components/ProjectsSection";
import { useLanguage } from "@/contexts/LanguageContext";

interface Project {
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

export default function OurWorkPage() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    // Scroll to top to show the display section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <Header navigation={navigation} scrollToSection={scrollToSection} />
      <main className="min-h-screen pt-24 pb-12">
        {/* Display Section - Top - Only show when a project is selected */}
        {selectedProject && (
          <ProjectDisplay 
            selectedProject={selectedProject} 
            onClose={handleCloseProject} 
          />
        )}
        
        {/* Projects Section - Bottom */}
        <ProjectsSection onProjectSelect={handleProjectSelect} />
      </main>
      <section id="footer">
        <Footer />
      </section>
    </>
  );
}
