import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/providers/client-providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Shot Form AI - AI 영상 생성 플랫폼',
  description: 'AI를 활용한 자동 숏폼 영상 생성 서비스',
  generator: 'Shot Form AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background-color: #f9fafb;
              color: #111827;
            }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-white { background-color: #ffffff !important; }
            .text-gray-900 { color: #111827 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
            .rounded-lg { border-radius: 0.5rem !important; }
            .p-4 { padding: 1rem !important; }
            .p-6 { padding: 1.5rem !important; }
            .p-8 { padding: 2rem !important; }
            .mb-4 { margin-bottom: 1rem !important; }
            .mb-6 { margin-bottom: 1.5rem !important; }
            .mb-8 { margin-bottom: 2rem !important; }
            .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
            .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
            .font-bold { font-weight: 700 !important; }
            .font-semibold { font-weight: 600 !important; }
            .min-h-screen { min-height: 100vh !important; }
            .max-w-7xl { max-width: 80rem !important; }
            .mx-auto { margin-left: auto !important; margin-right: auto !important; }
            .flex { display: flex !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .space-x-4 > * + * { margin-left: 1rem !important; }
            .border-b { border-bottom-width: 1px !important; border-color: #e5e7eb !important; }
            .sticky { position: sticky !important; }
            .top-0 { top: 0 !important; }
            .z-50 { z-index: 50 !important; }
            .h-16 { height: 4rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .py-8 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          `
        }} />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            {children}
            <Toaster />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
