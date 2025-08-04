"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RentalCatalog from "@/components/RentalCatalog";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RentalCatalogPage() {
  const { t } = useLanguage();

  const navigation = [
    { name: t("nav.HomePage"), href: "/" },
    { name: t("nav.work"), href: "/our-work" },
    { name: t("nav.rental"), href: "/rental-catalog" },
    // { name: t("nav.team"), href: "#team" },
    // { name: t("nav.clients"), href: "#clients" },
    { name: t("nav.contact"), href: "#footer" },
  ];

  const scrollToSection = (href: string) => {
    window.location.href = href;
  };

  return (
    <>
      <Header navigation={navigation} scrollToSection={scrollToSection} />
      <main className="min-h-screen pt-24 pb-12">
        <RentalCatalog />
      </main>
      <section id="footer">
        <Footer />
      </section>
    </>
  );
}
