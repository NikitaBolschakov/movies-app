const API_KEY = 'e286b0d05519263a082532a5d8580078';
const BASE_URL = `https://api.themoviedb.org/3`;

export const fetchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    if (!response.ok) {
      throw new Error('Ошибка при запросе к API');
    }
    const data = await response.json();
    console.log(data)
    return data.results;
  } catch (error) {
    console.error('Ошибка', error);
    return [];
  }
};
