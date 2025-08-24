import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NASA APOD - Astronomy Picture of the Day',
  description: 'Explore the cosmos with NASA\'s Astronomy Picture of the Day. Discover breathtaking images and videos of our universe, complete with expert explanations.',
  keywords: ['NASA', 'astronomy', 'space', 'cosmos', 'pictures', 'APOD'],
  authors: [{ name: 'NASA APOD Explorer' }],
  openGraph: {
    title: 'NASA APOD - Astronomy Picture of the Day',
    description: 'Explore the cosmos with NASA\'s Astronomy Picture of the Day',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NASA APOD - Astronomy Picture of the Day',
    description: 'Explore the cosmos with NASA\'s Astronomy Picture of the Day',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    NASA APOD
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Astronomy Picture of the Day
                  </p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="#today"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Today
                </a>
                <a
                  href="#gallery"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Gallery
                </a>
                <a
                  href="#random"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Random
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Powered by NASA's Astronomy Picture of the Day API
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Images and videos are courtesy of NASA and may be subject to copyright.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}