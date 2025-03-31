import { useEffect, useState } from 'react';

export const useRatedMovies = () => {
  const [ratedMovies, setRatedMovies] = useState([]); // Состояние для хранения оцененных фильмов

  useEffect(() => {
    const savedRatedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || [];
    setRatedMovies(savedRatedMovies); // Загружаем оцененные фильмы из localStorage при первом рендере
  }, []);

  // Функция для обработки рейтинга фильма
  const handleRateMovie = (movie) => {
    const updatedRatedMovies = [...ratedMovies, movie];
    setRatedMovies(updatedRatedMovies);
    localStorage.setItem('ratedMovies', JSON.stringify(updatedRatedMovies));
  };

  return { ratedMovies, handleRateMovie };
};
