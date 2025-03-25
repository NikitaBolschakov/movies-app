import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Rate } from 'antd';
import { format, parse } from 'date-fns';
import { GenresContext } from '../../contexts/genresContext';
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

  // Функция для определения цвета круга в зависимости от рейтинга
  const getRatingColor = (voteAverage) => {
    if (voteAverage >= 0 && voteAverage < 3) return '#E90000';
    if (voteAverage >= 3 && voteAverage < 5) return '#E97E00';
    if (voteAverage >= 5 && voteAverage < 7) return '#E9D100';
    if (voteAverage >= 7) return '#66E900';
    return '#E90000';
  };

  // Дата выхода фильма
  let releaseDate = 'Release date unknown';
  if (date) {
    const dateObj = parse(date, 'yyyy-MM-dd', new Date());
    releaseDate = format(dateObj, 'MMMM d, yyyy');
  }

  //Изображение для карточки
  const posterUrl = img
    ? `https://image.tmdb.org/t/p/w500${img}`
    : 'https://imgholder.ru/183x281/8493a8/adb9ca&text=NO+IMAGE&font=kelson&fz=40';

  // Отправка рейтинга
  const handleRatingChange = async (value) => {
    setRating(value);

    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value }),
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${import.meta.env.VITE_API_KEY}&guest_session_id=${sessionId}`,
        options
      );

      if (!response.ok) {
        throw new Error('Не удалось отправить рейтинг');
      }

      // Сохраняем оцененный фильм
      onRateMovie({ id, title, description, rating: value, img, date, voteAverage, genreIds });

      console.log('Рейтинг успешно отправлен!');
    } catch (error) {
      console.log('Ошибка при отправке рейтинга: ' + error.message);
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
