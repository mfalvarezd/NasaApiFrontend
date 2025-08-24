import axios from 'axios';
import { ApodData } from '@/types/apod';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Función para esperar entre requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para obtener APOD con retry y rate limiting
const fetchWithRetry = async (url: string, params: any, maxRetries: number = 3): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Agregar delay entre requests si no es el primer intento
      if (i > 0) {
        await delay(12000 * i); // 2s, 4s, 6s delays
      }
      
      const response = await axios.get(url, { params });
      return response;
    } catch (error: any) {
      console.log(`Attempt ${i + 1} failed:`, error.response?.status);
      
      if (error.response?.status === 429) {
        if (i === maxRetries - 1) {
          throw new Error('Rate limit exceeded. Please try again later or get your own NASA API key.');
        }
        // Wait longer for rate limit errors
        await delay(5000 * (i + 1));
        continue;
      }
      
      if (i === maxRetries - 1) {
        throw error;
      }
    }
  }
};

// Función para obtener APOD de una fecha específica o del día actual
export const fetchApod = async (date?: string): Promise<ApodData> => {
  try {
    const params = {
      api_key: NASA_API_KEY,
      ...(date && { date }),
    };

    const response = await fetchWithRetry(BASE_URL, params);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching APOD:', error);
    if (error.message?.includes('Rate limit')) {
      throw new Error('Too many requests. Please wait a moment and try again, or get your own NASA API key for unlimited access.');
    }
    throw new Error('Failed to fetch APOD data. Please check your internet connection.');
  }
};

// Función para obtener múltiples APODs (rango de fechas) - DESHABILITADA con DEMO_KEY
export const fetchApodRange = async (
  startDate: string,
  endDate: string
): Promise<ApodData[]> => {
  // Si está usando DEMO_KEY, no hacer múltiples requests
  if (NASA_API_KEY === 'DEMO_KEY') {
    throw new Error('Range requests require a personal NASA API key. Get yours free at https://api.nasa.gov/');
  }

  try {
    const params = {
      api_key: NASA_API_KEY,
      start_date: startDate,
      end_date: endDate,
    };

    const response = await fetchWithRetry(BASE_URL, params);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching APOD range:', error);
    if (error.message?.includes('Rate limit')) {
      throw new Error('Too many requests. Please wait and try again.');
    }
    throw new Error('Failed to fetch APOD range data');
  }
};

// Función para obtener un número específico de APODs aleatorios - DESHABILITADA con DEMO_KEY
export const fetchRandomApods = async (count: number = 5): Promise<ApodData[]> => {
  // Si está usando DEMO_KEY, no hacer múltiples requests
  if (NASA_API_KEY === 'DEMO_KEY') {
    throw new Error('Random images require a personal NASA API key. Get yours free at https://api.nasa.gov/');
  }

  try {
    const params = {
      api_key: NASA_API_KEY,
      count,
    };

    const response = await fetchWithRetry(BASE_URL, params);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching random APODs:', error);
    if (error.message?.includes('Rate limit')) {
      throw new Error('Too many requests. Please wait and try again.');
    }
    throw new Error('Failed to fetch random APOD data');
  }
};

// Función para obtener APODs de los últimos N días - DESHABILITADA con DEMO_KEY
export const fetchRecentApods = async (days: number = 7): Promise<ApodData[]> => {
  // Si está usando DEMO_KEY, solo devolver un array vacío
  if (NASA_API_KEY === 'DEMO_KEY') {
    console.warn('Recent images feature requires a personal NASA API key');
    return [];
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return fetchApodRange(formatDate(startDate), formatDate(endDate));
};

// Función para validar si una fecha es válida para APOD (desde 1995-06-16)
export const isValidApodDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const minDate = new Date('1995-06-16');
  const maxDate = new Date();
  
  return inputDate >= minDate && inputDate <= maxDate;
};