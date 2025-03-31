import { Tabs } from 'antd';
import { useGuestSession } from './hooks/useGuestSession';
import { useRatedMovies } from './hooks/useRatedMovies';
import { useMovieFetch } from './hooks/useMovieFetch';
import { truncateDescription } from './utils/helpers';
import { getTabItems } from './utils/tabsConfig';
import GenresProvider from './providers/GenresProvider';
import styles from './App.module.css';

function App() {
  const sessionId = useGuestSession(); // Загрузка guest session ID
  const { ratedMovies, handleRateMovie } = useRatedMovies(); // Загрузка оцененных фильмов и функция для их обработки
  const { movies, totalPages, isLoading, error, networkError, fetchMoviesWithDebounce } = useMovieFetch(sessionId); // Загрузка фильмов и их обработка

  const tabItems = getTabItems(
    ratedMovies,
    sessionId,
    handleRateMovie,
    isLoading,
    error,
    networkError,
    movies,
    totalPages,
    fetchMoviesWithDebounce,
    truncateDescription
  );

  return (
    <GenresProvider>
      <div className={styles.app}>
        <Tabs defaultActiveKey="1" centered items={tabItems} />
      </div>
    </GenresProvider>
  );
}

export default App;
