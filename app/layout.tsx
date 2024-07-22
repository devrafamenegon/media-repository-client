import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import ModalProvider from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acervo",
  description: "Media Repository Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="no-scrollbar">
        <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ModalProvider />
              <ToastProvider />
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
