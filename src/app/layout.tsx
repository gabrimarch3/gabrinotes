import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GabriNotes",
  description: "Un'applicazione che renderà semplici le tue note grazie all'AI!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
