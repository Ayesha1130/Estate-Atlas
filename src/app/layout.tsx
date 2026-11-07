import "./globals.css";
import Chat from "@/components/Chat";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LangProvider } from "@/lib/i18n";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "PropertyHub Premier | Pakistan's Luxury Real Estate & 3D Architectural Platform",
    template: "%s | PropertyHub Premier",
  },
  description:
    "Discover Pakistan's most prestigious architectural residences, penthouses, luxury villas, and commercial real estate in Lahore, Karachi, and Islamabad.",
  keywords: [
    "Luxury real estate Pakistan",
    "DHA Lahore villas",
    "Clifton Karachi penthouses",
    "Islamabad luxury houses",
    "Architectural real estate",
    "Pakistani property marketplace",
    "PropertyHub",
  ],
  openGraph: {
    title: "PropertyHub Premier | Architectural Real Estate",
    description: "Discover Pakistan's most prestigious residences, penthouses, and luxury villas.",
    type: "website",
    siteName: "PropertyHub Premier",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-bg text-txt">
        <LangProvider>
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
          <Chat />
        </LangProvider>
      </body>
    </html>
  );
}
