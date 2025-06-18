// Configuración Next
import type { Metadata } from "next";

// Fuentes
import { Geist, Geist_Mono } from "next/font/google";

// Hoja de estilo
import "./globals.css";

// Providers para el contexto
import { ClerkProvider } from '@clerk/nextjs'
import { SearchProvider } from "@/context/SearchContext";
import { OrderDetailsProvider } from '@/context/OrderDetailsContext';

// Componentes para tareas iniciales
import GlobalModals from "@/components/GlobalModals";
import UsuarioInitializer from "@/components/Clerk/UsuarioInitializer";


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
        <OrderDetailsProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <UsuarioInitializer />
              {children}
              <GlobalModals />
            </body>
          </html>
        </OrderDetailsProvider>
      </SearchProvider>
    </ClerkProvider>
  );
}
