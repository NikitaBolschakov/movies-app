import { Card, Button } from 'antd';
import { format, parse, isValid } from 'date-fns';
import styles from './MovieCard.module.css';

const MovieCard = ({ title, description, img, date }) => {
  
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const releaseDate = date ? format(dateObj, 'MMMM d, yyyy') : 'Release date unknown';
  const posterUrl = img
    ? `https://image.tmdb.org/t/p/w500${img}`
    : 'https://imgholder.ru/183x281/8493a8/adb9ca&text=NO+IMAGE&font=kelson&fz=40';

  return (
    <Card className={styles.customCard} styles={{ body: { padding: 0 } }}>
      <div className={styles.cardContent}>
        <div className={styles.cardImage}>
          <img style={{ width: '100%', maxWidth: '185px' }} src={posterUrl} alt="Card" />
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardHeader}>{title}</h3>
          <p className={styles.cardDate}>{releaseDate}</p>
          <div className={styles.cardButtons}>
            <Button className={styles.cardButton}>Action</Button>
            <Button className={styles.cardButton}>Драма</Button>
          </div>
          <p className="cardDescription">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
