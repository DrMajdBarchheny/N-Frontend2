import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import RTLWrapper from "@/components/RTLWrapper";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReduxProvider from "@/lib/redux/ReduxProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NIJARA - Exhibition Design & Event Experiences",
  description:
    "Leading creative agency specializing in exhibition design, interior fit-outs, and event experiences in Dubai, UAE.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="font-montserrat antialiased text-white overflow-x-hidden">
        <div className="min-h-screen bg-gradient-to-b from-[#0b1727] via-[#103261] to-[#2c5ea3ee]">

        <GoogleOAuthProvider clientId="68659669696-k4du5j5g2p38a25p7sfhl1qdr7p8pe0m.apps.googleusercontent.com">
          <ReduxProvider>
            <LanguageProvider>
              <RTLWrapper>{children}</RTLWrapper>
            </LanguageProvider>
          </ReduxProvider>
       </GoogleOAuthProvider>

        </div>
      </body>
    </html>
  );
}
