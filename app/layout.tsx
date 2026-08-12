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
  title: "Resume AI",
  description: "Interview practice and resume building in one app.",
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
