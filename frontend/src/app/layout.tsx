import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'Edukad — پلتفرم درخت مهارت هنرستان استارتاپی رکاد',
  description: 'یادگیری مبتنی بر درخت مهارت و مأموریت‌های واقعی هنرستان استارتاپی رکاد',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[#f8fafc] text-ink antialiased selection:bg-secondary/30">
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
