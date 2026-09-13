import type { Metadata } from "next";
import { Syne, IBM_Plex_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Mesa & Dados",
    template: "%s · Mesa & Dados",
  },
  description:
    "La estantería de casa: elige partida, mira el ranking y enseña reglas en minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col overflow-x-clip antialiased">
        <Header />
        <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
