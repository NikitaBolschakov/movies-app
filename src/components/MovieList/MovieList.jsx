import { Component } from 'react';
import { Col, Row, Spin } from 'antd';
import { fetchMovies } from '../../api';
import MovieCard from '../MovieCard/MovieCard';

class MovieList extends Component {
  state = {
    movies: [],
    loading: true,
  };

  componentDidMount() {
    this.getMovies();
  }

  getMovies = async () => {
    try {
      const movies = await fetchMovies('return');
      // Проверяем, является ли результат массивом
      if (Array.isArray(movies)) {
        this.setState({ movies, loading: false });
      } else {
        console.error('Fetched data is not an array:', movies);
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ loading: false }); // Устанавливаем loading в false даже при ошибке
    }
  };

  truncateDescription = (description) => {
    if (description.length > 100) {
      const truncatedText = description.substring(0, 100);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      const res = truncatedText.substring(0, lastSpaceIndex) + '...';

      return res;
    }

    return description;
  };

  render() {
    const { movies, loading } = this.state;
    console.log(movies);

    if (loading) {
      return <Spin size="large" />;
    }

    return (
      <Row gutter={[0, 36]} justify={'space-between'}>
        {Array.isArray(movies) && movies.length > 0 ? ( // Проверка на массив
          movies.map((movie) => (
            <Col span={10} key={movie.id}>
              <MovieCard title={movie.title} description={this.truncateDescription(movie.overview)} 
              img={movie.backdrop_path} date={movie.release_date}/>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <h2>No movies found</h2>
          </Col>
        )}
      </Row>
    );
  }
}

export default MovieList;

/* import { Row, Col } from 'antd';
import MovieCard from './../MovieCard/MovieCard';

const MovieList = ({ movies }) => {
  return (
    <Row gutter={[16, 16]}>
      {movies.map((movie) => (
        <Col key={movie.id} span={6}>
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
};

export default MovieList; */
