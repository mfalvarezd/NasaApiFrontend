import React, { useState } from 'react';
import Image from 'next/image';
import { ApodData } from '@/types/apod';

interface ApodCardProps {
  apod: ApodData;
  priority?: boolean;
  showFullDescription?: boolean;
}

const ApodCard: React.FC<ApodCardProps> = ({ 
  apod, 
  priority = false, 
  showFullDescription = false 
}) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength || showFullDescription) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (apod.media_type === 'video') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={apod.url}
            title={apod.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              VIDEO
            </span>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(apod.date)}
            </time>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {apod.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {truncateText(apod.explanation)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="relative aspect-video">
        {!imageError ? (
          <Image
            src={apod.url}
            alt={apod.title}
            fill
            className="object-cover"
            priority={priority}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2 mx-auto"
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
              <p className="text-sm text-gray-500">Image not available</p>
            </div>
          </div>
        )}
        
        {/* HD Image Link */}
        {apod.hdurl && !imageError && (
          <a
            href={apod.hdurl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
          >
            HD
          </a>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            ASTRONOMY PICTURE
          </span>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(apod.date)}
          </time>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {apod.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {truncateText(apod.explanation)}
        </p>

        {apod.explanation.length > 150 && !showFullDescription && (
          <button className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            Read more
          </button>
        )}
      </div>
    </div>
  );
};

export default ApodCard;