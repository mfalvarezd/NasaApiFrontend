import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApodData } from '@/types/apod';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string, 
  params: Record<string, string | number>, 
  maxRetries: number = 3
): Promise<AxiosResponse> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) {
        await delay(2000 * i);
      }
      
      const response = await axios.get(url, { 
        params,
        timeout: 10000
      });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(`Attempt ${i + 1} failed:`, axiosError.response?.status || axiosError.code);
      
      if (axiosError.response?.status === 429) {
        if (i === maxRetries - 1) {
          throw new Error('Rate limit exceeded. The free NASA API key (DEMO_KEY) has limited requests. Get your own free API key at https://api.nasa.gov/ for unlimited access.');
        }
        await delay(5000 * (i + 1));
        continue;
      }
      
      if (axiosError.response?.status === 403) {
        throw new Error('API access forbidden. Please check your NASA API key or get a free one at https://api.nasa.gov/');
      }
      
      if (axiosError.response?.status === 400) {
        throw new Error('Invalid request. The selected date might be outside the available range (since June 16, 1995).');
      }
      
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'TIMEOUT') {
        if (i === maxRetries - 1) {
          throw new Error('Request timeout. Please check your internet connection and try again.');
        }
        continue;
      }
      
      if (i === maxRetries - 1) {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
};

export const fetchApod = async (date?: string): Promise<ApodData> => {
  try {
    const params: Record<string, string> = {
      api_key: NASA_API_KEY,
      ...(date && { date }),
    };

    console.log('Fetching APOD with params:', params);
    const response = await fetchWithRetry(BASE_URL, params);
    console.log('APOD response:', response.data);
    return response.data;
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching APOD:', err);
    
    if (err instanceof Error) {
      if (err.message.includes('Rate limit') ||
          err.message.includes('API access forbidden') ||
          err.message.includes('Invalid request') ||
          err.message.includes('timeout')) {
        throw err;
      }
    }
    
    if (axios.isAxiosError(error)) {
      if (error.response && typeof error.response.status === 'number' && error.response.status >= 500) {
        throw new Error('NASA API is temporarily unavailable. Please try again later.');
      }
      
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
    }
    
    throw new Error('Failed to fetch APOD data. Please try again.');
  }
};

export const fetchApodRange = async (
  startDate: string,
  endDate: string
): Promise<ApodData[]> => {
  if (NASA_API_KEY === 'DEMO_KEY') {
    throw new Error('Gallery features require a personal NASA API key due to rate limits. Get yours free at https://api.nasa.gov/ - it only takes 2 minutes!');
  }

  try {
    const params: Record<string, string> = {
      api_key: NASA_API_KEY,
      start_date: startDate,
      end_date: endDate,
    };

    const response = await fetchWithRetry(BASE_URL, params);
    return response.data;
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching APOD range:', err);
    if (err.message.includes('Rate limit')) {
      throw new Error('Too many requests. Please wait and try again.');
    }
    throw new Error('Failed to fetch APOD range data');
  }
};

// Función para obtener un número específico de APODs aleatorios - Con mensaje mejorado para DEMO_KEY
export const fetchRandomApods = async (count: number = 5): Promise<ApodData[]> => {
  if (NASA_API_KEY === 'DEMO_KEY') {
    console.log('Random images skipped - requires personal API key');
    return [];
  }

  try {
    const params = {
      api_key: NASA_API_KEY,
      count,
    };

    const response = await fetchWithRetry(BASE_URL, params);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching random APODs:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        throw new Error('Too many requests. Please wait and try again.');
      }
    }
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait and try again.');
      }
    }
    
    throw new Error('Failed to fetch random APOD data');
  }
};

// Función para obtener APODs de los últimos N días - Retorna array vacío con DEMO_KEY
export const fetchRecentApods = async (days: number = 7): Promise<ApodData[]> => {
  // Si está usando DEMO_KEY, solo devolver un array vacío silenciosamente
  if (NASA_API_KEY === 'DEMO_KEY') {
    console.log('Recent images skipped - requires personal API key');
    return [];
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  try {
    return await fetchApodRange(formatDate(startDate), formatDate(endDate));
  } catch (error) {
    console.error('Error fetching recent APODs:', error);
    return []; // Return empty array instead of throwing
  }
};

// Función para validar si una fecha es válida para APOD (desde 1995-06-16)
export const isValidApodDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const minDate = new Date('1995-06-16');
  const maxDate = new Date();
  
  return inputDate >= minDate && inputDate <= maxDate;
};

// Función para obtener datos mock/demo cuando la API no está disponible
export const getMockApod = (): ApodData => {
  return {
    date: new Date().toISOString().split('T')[0],
    explanation: "This is a demonstration of the NASA APOD viewer. To see real astronomy images and data, please get your free NASA API key at https://api.nasa.gov/. The API key is free and takes just 2 minutes to obtain!",
    media_type: "image" as const,
    service_version: "v1",
    title: "Demo Mode - Get Your NASA API Key",
    url: "https://via.placeholder.com/800x600/1a1a2e/ffffff?text=Get+Your+NASA+API+Key",
    hdurl: "https://via.placeholder.com/1200x900/1a1a2e/ffffff?text=NASA+APOD+Demo"
  };
};