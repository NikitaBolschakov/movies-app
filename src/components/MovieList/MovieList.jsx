import { useState, useCallback, useRef } from 'react';
import { Input, Spin, Alert, Row, Col, Pagination } from 'antd';
import { debounce } from 'lodash';
import { fetchMovies } from '../../api';
import MovieCard from '../MovieCard/MovieCard';

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(isLoading)


  const inputRef = useRef(null);

  const fetchMoviesWithDebounce = useCallback(
    debounce(async (term, page) => {
      
      setIsLoading(true);

      //если нет сети - ошибка сети
      if (!navigator.onLine) {
        setNetworkError(true);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetchMovies(term, page);
        console.log(term, currentPage);
        if (response.results) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
          setIsLoading(false);
          setNetworkError(false);
        } else {
          console.error('Invalid response:', response);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err.message);
        setIsLoading(false);
      }
    }, 600),
    []
  );

  const onSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    fetchMoviesWithDebounce(term);
  };
  
  const handlePaginationChange = (pageNumber) => {
    console.log(`pageNumber: ${pageNumber}`);
    setCurrentPage(pageNumber);
    console.log(`2 pageNumber: ${pageNumber}`);
    fetchMoviesWithDebounce(searchTerm, pageNumber);
  };

  const truncateDescription = (description) => {
    if (description.length > 100) {
      const truncatedText = description.substring(0, 100);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      const res = truncatedText.substring(0, lastSpaceIndex) + '...';

      return res;
    }

    return description;
  };

  return (
    <>
      <Input
        ref={inputRef}
        placeholder="Type to search..."
        value={searchTerm}
        onChange={onSearchChange}
        style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}
      />
      {isLoading ? (
        <Spin size="large" style={{ paddingTop: '30%' }} />
      ) : error ? (
        <Alert
          message="Ошибка!"
          description={error}
          type="error"
          showIcon
        />
      ) : networkError ? (
        <Alert
          message="Ошибка сети"
          description="Пожалуйста, проверьте ваше интернет-соединение."
          type="error"
          showIcon
        />
      ) : (
        <Row gutter={[230, 36]} >
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <Col span={10} key={movie.id}>
                <MovieCard
                  title={movie.title}
                  description={truncateDescription(movie.overview)}
                  img={movie.backdrop_path}
                  date={movie.release_date}
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

export default MovieList;
