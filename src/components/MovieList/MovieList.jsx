import { useState, useRef } from 'react';
import { Input, Spin, Alert, Row, Col, Pagination } from 'antd';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieList.module.css';

const MovieList = ({
  sessionId,
  onRateMovie,
  isLoading,
  error,
  networkError,
  movies,
  totalPages,
  fetchMoviesWithDebounce,
  truncateDescription,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const inputRef = useRef(null);

  const onSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    fetchMoviesWithDebounce(term, 1, sessionId);
  };

  const handlePaginationChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchMoviesWithDebounce(searchTerm, pageNumber, sessionId);
  };

  return (
    <>
      <Input
        ref={inputRef}
        placeholder="Type to search..."
        value={searchTerm}
        onChange={onSearchChange}
        style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}
        autoFocus
      />
      {isLoading ? (
        <Spin size="large" style={{ paddingTop: '30%' }} />
      ) : !searchTerm ? (
        <Alert message={'Введите название фильма'} type="info" />
      ) : error ? (
        <Alert message="Ошибка!" description={error} type="error" showIcon />
      ) : networkError ? (
        <Alert
          message="Ошибка сети"
          description="Пожалуйста, проверьте ваше интернет-соединение."
          type="error"
          showIcon
        />
      ) : (
        <Row className={styles.row}>
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <Col key={movie.id} className={styles.col}>
                <MovieCard
                  className={styles.movieCard}
                  sessionId={sessionId}
                  title={movie.title}
                  description={truncateDescription(movie.overview)}
                  img={movie.backdrop_path}
                  date={movie.release_date}
                  id={movie.id}
                  onRateMovie={onRateMovie}
                  voteAverage={movie.vote_average}
                  genreIds={movie.genre_ids}
                  tabRated={false}
                  localRating={movie.rating}
                />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Alert message={'Фильмы не найдены'} type="info" showIcon />
            </Col>
          )}
        </Row>
      )}
      {!isLoading && totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={handlePaginationChange}
          align={'center'}
          defaultCurrent={1}
          showSizeChanger={false}
          style={{ textAlign: 'center', marginTop: '38px', marginBottom: '17px' }}
        />
      )}
    </>
  );
};

MovieList.propTypes = {
  sessionId: PropTypes.string.isRequired, // ID сессии
  onRateMovie: PropTypes.func.isRequired, // Функция для обработки оценки фильма
  isLoading: PropTypes.bool.isRequired, // Флаг загрузки
  error: PropTypes.string, // Сообщение об ошибке
  networkError: PropTypes.bool, // Флаг сетевой ошибки
  movies: PropTypes.arrayOf(
    // Массив фильмов
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      overview: PropTypes.string,
      backdrop_path: PropTypes.string,
      release_date: PropTypes.string,
    })
  ).isRequired,
  totalPages: PropTypes.number.isRequired, // Общее количество страниц
  fetchMoviesWithDebounce: PropTypes.func.isRequired, // Функция для поиска фильмов с дебаунсом
  truncateDescription: PropTypes.func.isRequired,
};

export default MovieList;
