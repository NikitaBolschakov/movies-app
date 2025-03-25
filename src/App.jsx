import { useEffect, useState, useCallback, useMemo } from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import { createGuestSession, fetchMovies, fetchRatedMovies } from './api';
import MovieList from './components/MovieList/MovieList';
import RatedMovies from './components/RatedMovies/RatedMovies';
import GenresProvider from './providers/GenresProvider';
import styles from './App.module.css';

function App() {
  const [sessionId, setSessionId] = useState(null); // Гостевая сессия
  const [ratedMovies, setRatedMovies] = useState([]); // Оцененные фильмы
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Загрузка guest session ID
  useEffect(() => {
    const fetchGuestSession = async () => {
      const savedSessionId = localStorage.getItem('guestSessionId'); // Получаем sessionId из localStorage

      if (savedSessionId) {
        setSessionId(savedSessionId); // Используем сохраненный sessionId
      } else {
        try {
          const dataSessionId = await createGuestSession();
          if (dataSessionId) {
            setSessionId(dataSessionId); // Сохраняем в состояние
            localStorage.setItem('guestSessionId', dataSessionId); // Сохраняем в localStorage
          } else {
            console.error('Не удалось создать гостевую сессию');
          }
        } catch (error) {
          console.error('Ошибка при создании гостевой сессии:', error);
        }
      }
    };

    fetchGuestSession();
  }, []);

  // Загрузка оцененных фильмов из localStorage для передачи в Rated
  useEffect(() => {
    const savedRatedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || [];

    setRatedMovies(savedRatedMovies);
  }, []);

  const fetchData = useCallback(async (term, page, sessionId) => {
    if (!sessionId) {
      console.error('Гостевая сессия не создана');
      return;
    }

    setIsLoading(true);
    setError(null); // Сброс ошибки при новом запросе

    //если нет сети - ошибка сети
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
        const ratedMovies = await fetchRatedMovies(sessionId);
        const ratedMoviesMap = new Map((ratedMovies || []).map((movie) => [movie.id, movie.rating]));

        // Обновляем фильмы с рейтингами
        const updatedMovies = response.results.map((movie) => ({
          ...movie,
          rating: ratedMoviesMap.get(movie.id) || 0,
        }));

        setMovies(updatedMovies);
        setTotalPages(response.total_pages);
        setIsLoading(false);
        setNetworkError(false);
      } else {
        console.error('Invalid response:', response);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Ошибка при получении данных: ' + err.message);
      setIsLoading(false);
    }
  }, []);

  //useMemo - cохраняет стабильную ссылку на функцию между рендерами
  //Предотвращает лишние ререндеры дочерних компонентов
  //Гарантирует, что debounce-функция пересоздаётся только при изменении зависимостей
  const fetchMoviesWithDebounce = useMemo(() => {
    return debounce(fetchData, 600);
  }, [fetchData]);

  // Сохранение оцененного фильма
  const handleRateMovie = (movie) => {
    const updatedRatedMovies = [...ratedMovies, movie];
    setRatedMovies(updatedRatedMovies); // Сохраняем в состояние

    localStorage.setItem('ratedMovies', JSON.stringify(updatedRatedMovies)); // Сохраняем в localStorage
  };

  // Обрезка описания фильма
  const truncateDescription = (description) => {
    if (description.length > 100) {
      const truncatedText = description.substring(0, 100);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      const res = truncatedText.substring(0, lastSpaceIndex) + '...';
      return res;
    }
    return description;
  };

  const tabItems = [
    {
      key: '1',
      label: 'Search',
      children: (
        <MovieList
          ratedMovies={ratedMovies}
          sessionId={sessionId}
          onRateMovie={handleRateMovie}
          isLoading={isLoading}
          error={error}
          networkError={networkError}
          movies={movies}
          totalPages={totalPages}
          fetchMoviesWithDebounce={fetchMoviesWithDebounce}
          truncateDescription={truncateDescription}
        />
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: (
        <RatedMovies
          ratedMovies={ratedMovies}
          sessionId={sessionId}
          onRateMovie={handleRateMovie}
          isLoading={isLoading}
          error={error}
          networkError={networkError}
          totalPages={totalPages}
          truncateDescription={truncateDescription}
        />
      ),
    },
  ];

  return (
    <GenresProvider>
      <div className={styles.app}>
        <Tabs defaultActiveKey="1" centered items={tabItems} />
      </div>
    </GenresProvider>
  );
}

export default App;
