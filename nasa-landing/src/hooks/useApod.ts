import { useState, useEffect, useCallback } from 'react';
import { ApodData } from '@/types/apod';
import { fetchApod, fetchRecentApods, fetchRandomApods } from '@/utils/api';

interface UseApodState {
  data: ApodData | null;
  loading: boolean;
  error: string | null;
}

interface UseApodArrayState {
  data: ApodData[];
  loading: boolean;
  error: string | null;
}

// Hook para obtener APOD de una fecha específica o del día actual
export const useApod = (date?: string) => {
  const [state, setState] = useState<UseApodState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadApod = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await fetchApod(date);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    loadApod();
  }, [date]);

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchApod(date);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return { ...state, refetch };
};

// Hook para obtener múltiples APODs recientes
export const useRecentApods = (days: number = 7) => {
  const [state, setState] = useState<UseApodArrayState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadRecentApods = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await fetchRecentApods(days);
        setState({ data: data.reverse(), loading: false, error: null }); // Reverse para mostrar más recientes primero
      } catch (error) {
        setState({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    loadRecentApods();
  }, [days]);

  return state;
};

// Hook para obtener APODs aleatorios
export const useRandomApods = (count: number = 5) => {
  const [state, setState] = useState<UseApodArrayState>({
    data: [],
    loading: true,
    error: null,
  });

  const loadRandomApods = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchRandomApods(count);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [count]); // Dependencia count para useCallback

  useEffect(() => {
    loadRandomApods();
  }, [loadRandomApods]); // Ahora usamos loadRandomApods como dependencia

  const refetch = useCallback(() => {
    loadRandomApods();
  }, [loadRandomApods]);

  return { ...state, refetch };
};