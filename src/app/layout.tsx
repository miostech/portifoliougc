import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Portfolio UGC — Seu portfólio profissional em 10 minutos",
    template: "%s · Portfolio UGC",
  },
  description:
    "Crie e hospede um portfólio profissional de criador de conteúdo (UGC) em menos de 10 minutos. Onboarding rápido, geração por IA e uma página pública linda para conquistar marcas.",
  keywords: [
    "UGC",
    "portfólio",
    "criador de conteúdo",
    "user generated content",
    "portfólio profissional",
  ],
  openGraph: {
    title: "Portfolio UGC — Seu portfólio profissional em 10 minutos",
    description:
      "Crie e hospede seu portfólio de criador UGC em menos de 10 minutos.",
    type: "website",
    url: appUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
