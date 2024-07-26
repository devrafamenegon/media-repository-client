import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/providers/toast-provider";
import { glancyr } from "./fonts";
import MediaModalProvider from "@/providers/media-modal-provider";
import SecurityModalProvider from "@/providers/security-modal-provider";

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
        <body className={glancyr.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <MediaModalProvider />
              <SecurityModalProvider />
              <ToastProvider />
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
