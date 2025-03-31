import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Rate } from 'antd';
import { getRatingColor } from '../../utils/helpers';
import { formatReleaseDate } from '../../utils/date';
import { getPosterUrl } from '../../utils/images';
import { GenresContext } from '../../contexts/genresContext';
import { rateMovie } from '../../api';
import styles from './MovieCard.module.css';

const MovieCard = ({
  title,
  description,
  img,
  date,
  sessionId,
  id,
  onRateMovie,
  ratingCard,
  tabRated,
  voteAverage,
  genreIds,
  localRating,
}) => {
  const [rating, setRating] = useState(0); // Состояние для хранения переданного рейтинга

  const ratingUser = localRating; // Загруженный рейтинг фильмов, которые пользователь уже оценил
  const genres = useContext(GenresContext); // Получаем список жанров из контекста
  // Функция для получения названий жанров по их ID
  const getGenres = (genreIds) => {
    return genreIds.map((id) => genres.find((genre) => genre.id === id)?.name).filter(Boolean);
  };
  const releaseDate = formatReleaseDate(date); // Дата выхода фильма
  const posterUrl = getPosterUrl(img); // Получаем URL изображения для карточки

  // Отправка рейтинга
  const handleRatingChange = async (value) => {
    setRating(value);
    try {
      await rateMovie(id, sessionId, value);
      onRateMovie({ id, title, description, rating: value, img, date, voteAverage, genreIds });
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error);
    }
  };

  return (
    <Card className={styles.customCard} styles={{ body: { padding: 0 } }}>
      <div className={styles.cardContent}>
        <div className={styles.ratingCircle} style={{ borderColor: getRatingColor(voteAverage) }}>
          {voteAverage?.toFixed(1)}
        </div>

        <div className={styles.cardImage}>
          <img style={{ width: '100%', maxWidth: '185px' }} src={posterUrl} alt="Card" />
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardHeader}>{title}</h3>
          <p className={styles.cardDate}>{releaseDate}</p>
          <div className={styles.cardButtons}>
            {getGenres(genreIds).map((genre) => (
              <Button key={genre} className={styles.cardButton} disabled>
                {genre}
              </Button>
            ))}
          </div>
          <p className={styles.cardDescription}>{description}</p>
          <div className={styles.rate}>
            {tabRated ? (
              <Rate count={10} disabled defaultValue={ratingCard} allowHalf style={{ fontSize: '14px' }} />
            ) : (
              <Rate
                count={10}
                disabled={rating || ratingUser}
                onChange={handleRatingChange}
                value={rating ? rating : ratingUser}
                allowHalf
                style={{ fontSize: '14px' }}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  img: PropTypes.string,
  date: PropTypes.string,
  sessionId: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onRateMovie: PropTypes.func.isRequired,
  tabRated: PropTypes.bool.isRequired,
  ratingCard: PropTypes.number,
  voteAverage: PropTypes.number,
  localRating: PropTypes.number,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

MovieCard.defaultProps = {
  description: 'Описание отсутствует',
  img: '',
  date: '',
};

export default MovieCard;
