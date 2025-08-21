import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/articles-sidebar"
import { MockProvider } from "@/components/MockProvider"
import { ThemeProvider } from "@/components/theme-provider"
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
          <MockProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 flex flex-col overflow-auto">
                <div className="flex items-center gap-2 p-4 border-b">
                  <SidebarTrigger />
                  <h2 className="font-semibold text-lg">Create Articles</h2>
                </div>
                {children}
              </main>
            </SidebarProvider>
            <Toaster />
          </MockProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
