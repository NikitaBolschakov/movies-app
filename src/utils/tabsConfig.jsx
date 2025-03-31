import MovieList from '../components/MovieList/MovieList';
import RatedMovies from '../components/RatedMovies/RatedMovies';

export const getTabItems = (
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
) => [
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