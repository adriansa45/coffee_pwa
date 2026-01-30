import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pasaporte del café",
  description: "Pasaporte del café",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative w-full h-screen bg-brand-50/30 overflow-hidden">
          <TopNav />
          <main className="w-full h-full overflow-auto">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
