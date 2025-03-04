import { Component } from 'react';
import { Col, Row, Spin, Alert } from 'antd';
import { fetchMovies } from '../../api';
import MovieCard from '../MovieCard/MovieCard';

class MovieList extends Component {
  state = {
    movies: [],
    loading: true,
    error: null,
    networkError: false,
  };

  componentDidMount() {
    this.getMovies();
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  //Удаляем слушатели
  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  handleNetworkChange = () => {
    this.setState({ networkError: !navigator.onLine });
  };

  getMovies = async () => {
    if (!navigator.onLine) {
      this.setState({ networkError: true, loading: false });
      return;
    }

    try {
      const movies = await fetchMovies('begin');

      // Проверяем, является ли результат массивом
      if (Array.isArray(movies)) {
        this.setState({ movies, loading: false, networkError: false });
      } else {
        console.error('Fetched data is not an array:', movies);
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ loading: false, error: error.message }); // Устанавливаем loading в false даже при ошибке
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
    const { movies, loading, networkError, error } = this.state;

    if (loading) {
      return <Spin size="large" style={{ paddingTop: '30%' }} />;
    }

     if (error) {
      return (
        <Alert
          message="Ошибка!"
          description={error}
          type="error"
          showIcon
        />
      );
    }

    if (networkError) {
      return (
        <Alert
          message="Ошибка сети"
          description="Пожалуйста, проверьте ваше интернет-соединение."
          type="error"
          showIcon
        />
      );
    }

    return (
      <Row gutter={[0, 36]} justify={'space-between'}>
        {Array.isArray(movies) && movies.length > 0 ? ( 
          movies.map((movie) => (
            <Col span={10} key={movie.id}>
              <MovieCard
                title={movie.title}
                description={this.truncateDescription(movie.overview)}
                img={movie.backdrop_path}
                date={movie.release_date}
              />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Alert message={'No movies found'} type="error" showIcon />
          </Col>
        )}
      </Row>
    );
  }
}

export default MovieList;
