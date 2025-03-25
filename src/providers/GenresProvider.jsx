import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchGenres } from '../api';
import { GenresContext } from '../contexts/genresContext';

const GenresProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  // Загрузка жанров при старте приложения
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error('Ошибка при загрузке жанров:', error);
      }
    };

    loadGenres();
  }, []);

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>;
};

GenresProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GenresProvider;
