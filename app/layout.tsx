import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import ModalProvider from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Media Repository Client",
  description: "Media Repository Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ModalProvider />
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
