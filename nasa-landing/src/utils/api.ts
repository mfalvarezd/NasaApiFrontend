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
        await delay(2000 * i); // 2s, 4s, 6s delays
      }
      
      const response = await axios.get(url, { 
        params,
        timeout: 10000 // 10 second timeout
      });
      return response;
    } catch (error: any) {
      console.log(`Attempt ${i + 1} failed:`, error.response?.status || error.code);
      
      if (error.response?.status === 429) {
        if (i === maxRetries - 1) {
          throw new Error('Rate limit exceeded. The free NASA API key (DEMO_KEY) has limited requests. Get your own free API key at https://api.nasa.gov/ for unlimited access.');
        }
        // Wait longer for rate limit errors
        await delay(5000 * (i + 1));
        continue;
      }
      
      if (error.response?.status === 403) {
        throw new Error('API access forbidden. Please check your NASA API key or get a free one at https://api.nasa.gov/');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Invalid request. The selected date might be outside the available range (since June 16, 1995).');
      }
      
      if (error.code === 'ECONNABORTED' || error.code === 'TIMEOUT') {
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
};

// Función para obtener APOD de una fecha específica o del día actual
export const fetchApod = async (date?: string): Promise<ApodData> => {
  try {
    const params = {
      api_key: NASA_API_KEY,
      ...(date && { date }),
    };

    console.log('Fetching APOD with params:', params);
    const response = await fetchWithRetry(BASE_URL, params);
    console.log('APOD response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching APOD:', error);
    
    if (error.message?.includes('Rate limit')) {
      throw error; // Re-throw the custom rate limit message
    }
    
    if (error.message?.includes('API access forbidden')) {
      throw error;
    }
    
    if (error.message?.includes('Invalid request')) {
      throw error;
    }
    
    if (error.message?.includes('timeout')) {
      throw error;
    }
    
    if (error.response?.status >= 500) {
      throw new Error('NASA API is temporarily unavailable. Please try again later.');
    }
    
    // Generic network error
    if (!error.response) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw new Error('Failed to fetch APOD data. Please try again.');
  }
};

// Función para obtener múltiples APODs (rango de fechas) - Con mejor manejo para DEMO_KEY
export const fetchApodRange = async (
  startDate: string,
  endDate: string
): Promise<ApodData[]> => {
  // Si está usando DEMO_KEY, mostrar mensaje más claro
  if (NASA_API_KEY === 'DEMO_KEY') {
    throw new Error('Gallery features require a personal NASA API key due to rate limits. Get yours free at https://api.nasa.gov/ - it only takes 2 minutes!');
  } else {
    console.log(NASA_API_KEY);
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

// Función para obtener un número específico de APODs aleatorios - Con mensaje mejorado para DEMO_KEY
export const fetchRandomApods = async (count: number = 5): Promise<ApodData[]> => {
  // Si está usando DEMO_KEY, retornar array vacío silenciosamente en lugar de error
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
  } catch (error: any) {
    console.error('Error fetching random APODs:', error);
    if (error.message?.includes('Rate limit')) {
      throw new Error('Too many requests. Please wait and try again.');
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