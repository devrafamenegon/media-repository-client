import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import ModalProvider from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { glancyr } from "./fonts";

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
              <ModalProvider />
              <ToastProvider />
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
