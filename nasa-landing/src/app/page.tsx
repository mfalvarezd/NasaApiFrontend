'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import { useApod, useRecentApods, useRandomApods } from '@/hooks/useApod';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const { data: todayApod, loading: todayLoading, error: todayError } = useApod(selectedDate || undefined);
  const { data: recentApods, loading: recentLoading, error: recentError } = useRecentApods(7);
  const { data: randomApods, loading: randomLoading, error: randomError, refetch: refetchRandom } = useRandomApods(6);

  const handleDateChange = (date: string) => setSelectedDate(date);
  const handleBackToToday = () => setSelectedDate('');


  return (
    <>
      {/* Hero Section - Siempre visible */}
      <section id="today">
        <Hero
          apod={todayApod}
          loading={todayLoading}
          error={todayError}
          onDateChange={handleDateChange}
        />
      </section>

      {/* Back to Today Button */}
      {selectedDate && (
        <div className="sticky top-4 z-50 flex justify-center">
          <button
            onClick={handleBackToToday}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            ← Back to Today
          </button>
        </div>
      )}

      {/* Gallery Section - Siempre visible */}
      <section id="gallery" className="py-20">
        <Gallery
          title="Recent Cosmic Discoveries"
          subtitle="Explore the latest astronomical wonders captured in the past week"
          apods={recentApods}
          loading={recentLoading}
          error={recentError}
        />
      </section>

      {/* Random Gallery Section - Siempre visible */}
      <section id="random" className="py-20 bg-gray-50 dark:bg-gray-900">
        <Gallery
          title="Random Cosmic Wonders"
          subtitle="Discover random gems from NASA&apos;s vast collection of astronomical imagery"
          apods={randomApods}
          loading={randomLoading}
          error={randomError}
          onRefresh={refetchRandom}
          showRefreshButton={true}
        />
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About NASA APOD
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Daily Wonder
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every day, NASA presents a new image or video of our fascinating universe, 
                complete with a brief explanation written by a professional astronomer.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Educational Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn about cosmic phenomena, space missions, and astronomical discoveries 
                through expert explanations that make complex science accessible.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Rich Archive
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore nearly 30 years of astronomical imagery dating back to 1995, 
                with thousands of stunning images and videos from space.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Start Your Cosmic Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Whether you&apos;re an astronomy enthusiast, student, or simply curious about the universe, 
                APOD offers a daily dose of cosmic wonder that will expand your understanding of space.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#today"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>View Today&apos;s Image</span>
                </a>
                <a
                  href="https://apod.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Visit NASA APOD</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}