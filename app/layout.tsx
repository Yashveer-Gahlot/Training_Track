import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Enigma",
  description: "A tool for tracking competitive programming training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased font-sans cp-background" // This class applies the new background
        )}
      >
        <Providers>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Setting dark theme as default for the new aesthetic
          enableSystem
          disableTransitionOnChange
          >
          <div className="relative z-10">
            <NavBar />
            <main>{children}</main>
          </div>
        </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}