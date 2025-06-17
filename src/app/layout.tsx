import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";
import ModalSearch from "@/components/ModalSearch";
import { useSearch } from "@/context/SearchContext";
import GlobalModals from "@/components/GlobalModals";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESCOM-IDA",
  description: "Sistema gestor para la cafeteria grande de la ESCOM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <SearchProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <GlobalModals />
          </body>
        </html>
      </SearchProvider>
    </ClerkProvider>
  );
}
