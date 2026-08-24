import { useState, useCallback, useEffect } from 'react';
import type { WeatherResponse, APIError, ErrorCode } from '../types/weather';
import { fetchWeatherData, fetchWeatherByCoords } from '../services/weatherApi';

interface UseWeatherState {
  data: WeatherResponse | null;
  isLoading: boolean;
  error: { code: ErrorCode; message: string } | null;
}

interface UseWeatherReturn extends UseWeatherState {
  searchCity: (city: string) => Promise<void>;
  useCurrentLocation: () => Promise<void>;
  clearError: () => void;
}

export function useWeather(defaultCity: string = 'Hyderabad'): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const searchCity = useCallback(async (city: string) => {
    if (!city.trim()) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchWeatherData(city);
      setState({ data, isLoading: false, error: null });
    } catch (err: unknown) {
      const apiError = err as APIError;
      if (apiError?.error?.code) {
        setState({
          data: null,
          isLoading: false,
          error: apiError.error,
        });
      } else {
        setState({
          data: null,
          isLoading: false,
          error: {
            code: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred. Please try again.',
          },
        });
      }
    }
  }, []);

  const useCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          code: 'LOCATION_UNAVAILABLE',
          message: 'Geolocation is not supported by your browser.',
        },
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      const data = await fetchWeatherByCoords(latitude, longitude);
      setState({ data, isLoading: false, error: null });
    } catch (err: unknown) {
      const geoError = err as GeolocationPositionError;
      let errorCode: ErrorCode = 'LOCATION_UNAVAILABLE';
      let errorMessage = 'Could not determine your location.';

      if (geoError?.code === 1) {
        errorCode = 'LOCATION_DENIED';
        errorMessage = 'Location access was denied. Please enable location permissions or search for a city.';
      } else if (geoError?.code === 3) {
        errorCode = 'LOCATION_UNAVAILABLE';
        errorMessage = 'Location request timed out. Please try again or search for a city.';
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: errorCode, message: errorMessage },
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Load default city on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    searchCity(defaultCity);
  }, [defaultCity, searchCity]);

  return {
    ...state,
    searchCity,
    useCurrentLocation,
    clearError,
  };
}
