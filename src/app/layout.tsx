import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import 'katex/dist/katex.min.css';
import { AuthProvider } from '@/components/app/auth-provider';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { HistorySidebarContent } from '@/components/app/history-sidebar-content';
import { Header } from '@/components/app/header';

export const metadata: Metadata = {
  title: 'StudySphere',
  description: 'An intelligent study helper powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0KOVwNw43InterQaZnDDRWzI unusAmdFnoPaOUbSiMld/flE/qt2rzP9SLLTUNHIU" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SidebarProvider>
            <Sidebar>
              <HistorySidebarContent />
            </Sidebar>
            <SidebarInset>
              <Header />
              <main className="flex-1 flex flex-col">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
