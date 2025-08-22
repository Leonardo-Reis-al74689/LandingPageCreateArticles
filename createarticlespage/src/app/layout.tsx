import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/articles-sidebar"
import { MockProvider } from "@/components/MockProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationProvider } from "@/contexts/NavigationContext"
import { DynamicHeader } from "@/components/DynamicHeader"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NavigationProvider>
            <MockProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col overflow-auto">
                  <DynamicHeader />
                  {children}
                </main>
              </SidebarProvider>
              <Toaster />
            </MockProvider>
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
