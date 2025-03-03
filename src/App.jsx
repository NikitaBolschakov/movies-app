import MovieList from './components/MovieList/MovieList';
import styles from './App.module.css';


function App() {
  return (
    <div className={styles.app}>
      <h1>Movies App</h1>
      <MovieList />
    </div>
  );
}

export default App;


/* import { Component } from 'react';
import { fetchMovies } from './api';
import MoviesList from './components/MovieList/MovieList';
import SearchBar from './components/SearchBar/SearchBar';

class App extends Component {
  state = {
    movies: [],
    isLoading: false,
    error: null,
  };

  handleSearch = async (query) => {
    this.state({ isLoading: true, error: null });

    try {
      const movies = await fetchMovies(query);
      this.setState({ movies, isLoading: false });
    } catch (err) {
      this.setState({ error: 'Не удалось загрузить фильмы', isLoading: false });
    }
  };

  render() {
    const { movies, isLoading, error } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <SearchBar onSearch={this.handleSearch()} />
        {isLoading && <p>Загрузка...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <MoviesList movies={movies} />
      </div>
    );
  }
}

export default App; */
