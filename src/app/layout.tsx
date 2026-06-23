import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";

export const metadata: Metadata = {
  title: "CollegeDiscover - Find Your Perfect College",
  description:
    "Explore, compare, and save colleges across India. Make informed decisions with detailed information, reviews, and side-by-side comparisons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CompareBar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
