import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/providers/client-providers'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ToastProvider } from '@/components/ui/toast'
import { AuthProvider } from '@/components/providers/auth-provider'

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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AuthProvider>
              <ClientProviders>
                {children}
                <Toaster />
              </ClientProviders>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
