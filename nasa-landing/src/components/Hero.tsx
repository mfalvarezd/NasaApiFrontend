import React, { useState } from "react";
import Image from "next/image";
import { ApodData } from "@/types/apod";
import Loading from "./Loading";

interface HeroProps {
  apod: ApodData | null;
  loading: boolean;
  error: string | null;
  onDateChange?: (date: string) => void;
}

const Hero: React.FC<HeroProps> = ({ apod, loading, error, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && onDateChange) {
      onDateChange(selectedDate);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getMinDate = () => {
    return "1995-06-16"; // First APOD date
  };

  // Función para determinar si usar fondo oscuro o claro
  const shouldUseDarkBackground = () => {
    return (
      loading || error || !apod || imageError || apod.media_type === "video"
    );
  };

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loading size="lg" text="Loading today's cosmic wonder..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-full">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Unable to load APOD</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors mr-4"
            >
              Try Again
            </button>
            <div className="text-sm text-gray-400">
              <p>
                💡 Tip: Get your own free NASA API key at{" "}
                <a
                  href="https://api.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  api.nasa.gov
                </a>{" "}
                for unlimited access!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!apod) return null;

  return (
    <section id="today" className="relative min-h-screen">
      {/* Background Image/Video */}
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {(() => {
          // URL de la imagen (hd si existe)
          const src = apod.hdurl || apod.url;
          const isGif = /\.gif($|\?)/i.test(src);

          // Si es imagen (no video) y no hay error, renderiza con next/image.
          if (apod.media_type === "image" && !imageError) {
            return (
              <>
                <Image
                  src={src}
                  alt={apod.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  unoptimized={isGif} // ← desactiva optimizador solo para GIFs
                  onError={() => setImageError(true)}
                />
                {/* Velo para contraste del texto */}
                <div className="absolute inset-0 bg-black/40" />
              </>
            );
          }

          // Fallback (video, error de imagen, o no hay media)
          return (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
              <div className="absolute inset-0 bg-black/20" />
              {/* Estrellitas sutiles opcionales */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-1500"></div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div
              className={`space-y-6 ${
                shouldUseDarkBackground() ? "text-white" : "text-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-400 font-medium text-sm tracking-wide uppercase">
                    {apod.media_type === "video"
                      ? "Astronomy Video"
                      : "Astronomy Picture"}{" "}
                    of the Day
                  </span>
                  <div className="h-px bg-blue-400 flex-1 max-w-20" />
                </div>
                <time className="text-gray-300 text-lg">
                  {formatDate(apod.date)}
                </time>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {apod.title}
              </h1>

              <div className="space-y-4">
                <p className="text-gray-200 text-lg leading-relaxed">
                  {showFullDescription
                    ? apod.explanation
                    : `${apod.explanation.slice(0, 200)}${
                        apod.explanation.length > 200 ? "..." : ""
                      }`}
                </p>

                {apod.explanation.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {showFullDescription ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {apod.hdurl && apod.media_type === "image" && !imageError && (
                  <a
                    href={apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>View HD Image</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: apod.title,
                        text: `Check out today's Astronomy Picture of the Day: ${apod.title}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  className="bg-violet-950 bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg inline-flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </button>
              </div>

              {/* Mensaje informativo si está usando DEMO_KEY */}
              {imageError && (
                <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border border-yellow-400 border-opacity-30">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-yellow-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div className="text-sm text-yellow-200">
                      <p className="font-medium mb-1">
                        Image couldn't be loaded
                      </p>
                      <p>
                        This might be due to API rate limits. Get your free NASA
                        API key at{" "}
                        <a
                          href="https://api.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          api.nasa.gov
                        </a>{" "}
                        for better performance!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Player or Date Selector */}
            <div className="space-y-6">
              {apod.media_type === "video" && (
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Date Selector */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-black text-lg font-semibold mb-4">
                  Explore Other Dates
                </h3>
                <form onSubmit={handleDateSubmit} className="space-y-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getTodayDate()}
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm text-black placeholder-gray-300 border border-black border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent [color-scheme:dark]"
                  />
                  <button
                    type="submit"
                    disabled={!selectedDate}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    View APOD
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
