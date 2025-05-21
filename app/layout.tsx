import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Canvas",
  description:
    "A modern, interactive data visualization solution built with Next.js 15 and React 19.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-tight">
                Data Canvas
              </h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 w-full">{children}</main>
          {/* <footer className="mt-12 border-t bg-muted/30 text-muted-foreground text-sm">
          </footer> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
