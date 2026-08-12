import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume AI | Land Your Dream Job",
  description: "Stop staring at a blank page. Let our AI interview you and automatically build an ATS-beating resume in under 5 minutes.",
  keywords: ["resume builder", "AI resume", "ATS friendly resume", "interview practice", "career", "jobs"],
  authors: [{ name: "Resume AI" }],
  openGraph: {
    title: "Resume AI | ATS-Beating AI Resume Builder",
    description: "Build an ATS-optimized resume in 5 minutes by just chatting with our AI.",
    url: "https://resume-ai.com",
    siteName: "Resume AI",
    images: [
      {
        url: "/images/hero.png",
        width: 800,
        height: 600,
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume AI",
    description: "Build an ATS-optimized resume in 5 minutes.",
    images: ["/images/hero.png"],
  },
};

import SmoothScrolling from "@/components/SmoothScrolling";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-text-primary">
        <CustomCursor />
        <SmoothScrolling>
          <AuthProvider>
            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>
            {children}
          </AuthProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
