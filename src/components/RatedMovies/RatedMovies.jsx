import { useState } from 'react';
import { Spin, Alert, Row, Col, Pagination } from 'antd';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard';
import styles from './RatedMovies.module.css';

const RatedMovies = ({ ratedMovies, sessionId, onRateMovie, isLoading, error, networkError, truncateDescription }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Количество фильмов на странице
  const moviesPerPage = 10;

  // Расчет общего количества страниц
  const totalPages = Math.ceil(ratedMovies.length / moviesPerPage);

  // Получение фильмов для текущей страницы
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = ratedMovies.slice(startIndex, endIndex);

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isLoading ? (
        <Spin size="large" style={{ paddingTop: '30%' }} />
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
          {Array.isArray(currentMovies) && currentMovies.length > 0 ? (
            currentMovies.map((movie) => (
              <Col key={movie.id} className={styles.col}>
                <MovieCard
                  className={styles.movieCard}
                  sessionId={sessionId}
                  title={movie.title}
                  description={truncateDescription(movie.description)}
                  img={movie.img}
                  date={movie.date}
                  id={movie.id}
                  onRateMovie={onRateMovie}
                  voteAverage={movie.voteAverage}
                  tabRated={true}
                  ratingCard={movie.rating}
                  genreIds={movie.genreIds}
                />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Alert message={'Здесь будут фильмы которые вы оценивали'} type="info" />
            </Col>
          )}
        </Row>
      )}
      {!isLoading && totalPages >= 1 && (
        <Pagination
          current={currentPage}
          total={ratedMovies.length} // Общее количество фильмов
          pageSize={moviesPerPage} // Количество фильмов на странице
          onChange={handlePaginationChange}
          align={'center'}
          defaultCurrent={1}
          showSizeChanger={false}
          hideOnSinglePage={false} // Отображать пагинацию даже при одной странице
          style={{ textAlign: 'center', marginTop: '38px', marginBottom: '17px' }}
        />
      )}
    </>
  );
};

RatedMovies.propTypes = {
  sessionId: PropTypes.string.isRequired, // ID сессии
  onRateMovie: PropTypes.func.isRequired, // Функция для обработки оценки фильма
  isLoading: PropTypes.bool.isRequired, // Флаг загрузки
  error: PropTypes.string, // Сообщение об ошибке
  networkError: PropTypes.bool, // Флаг сетевой ошибки
  totalPages: PropTypes.number.isRequired, // Общее количество страниц
  truncateDescription: PropTypes.func.isRequired,
  ratedMovies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      img: PropTypes.string,
    })
  ).isRequired,
};

export default RatedMovies;
