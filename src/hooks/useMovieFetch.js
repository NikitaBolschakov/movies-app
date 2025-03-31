import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { fetchMovies, fetchRatedMovies } from '../api'; 

export const useMovieFetch = (sessionId) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);

  const fetchData = useCallback(async (term, page) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null); // Сброс ошибки при новом запросе
    
    // Если нет сети - ошибка сети
    if (!navigator.onLine) {
      setNetworkError(true);
      setIsLoading(false);
      return;
    } else {
      setNetworkError(false);
    }

    try {
      const response = await fetchMovies(term, page, sessionId); 

      
      if (response.results) { 
        // Получаем рейтинги для фильмов
        // Используем fetchRatedMovies для получения оцененных фильмов
        const ratedMovies = await fetchRatedMovies(sessionId);
        const ratedMoviesMap = new Map((ratedMovies || []).map((movie) => [movie.id, movie.rating]));

        // Обновляем фильмы с рейтингами
        const updatedMovies = response.results.map((movie) => ({
          ...movie,
          rating: ratedMoviesMap.get(movie.id) || 0,
        }));

        setMovies(updatedMovies);
        setTotalPages(response.total_pages);
      }
    } catch (err) {
      setError('Ошибка при получении данных: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const fetchMoviesWithDebounce = useMemo(() => debounce(fetchData, 600), [fetchData]);

  return { movies, totalPages, isLoading, error, networkError, fetchMoviesWithDebounce };
};