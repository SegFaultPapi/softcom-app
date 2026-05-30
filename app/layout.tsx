import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { NavBar } from '@/components/nav-bar'
import { AppPrivyProvider } from '@/components/dynamic-provider'

export const metadata: Metadata = {
  title: 'SoftCom Solutions — Plataforma de Valuación de Bonos',
  description: 'Plataforma institucional para valuación de bonos, gestión de portafolios y análisis de riesgo.',
  generator: 'SoftCom',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <AppPrivyProvider>
          <AuthProvider>
            <NavBar />
            <main>{children}</main>
          </AuthProvider>
        </AppPrivyProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
