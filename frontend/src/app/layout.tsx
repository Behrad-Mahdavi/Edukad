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
  icons: {
    icon: '/images/edukad-logo.jpg',
    shortcut: '/images/edukad-logo.jpg',
    apple: '/images/edukad-logo.jpg',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-[#292827] dark:text-[#F1F5F9] antialiased transition-colors duration-200" dir="rtl">
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col" dir="rtl">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-8 text-right" dir="rtl">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
