const API_KEY = 'e286b0d05519263a082532a5d8580078'; // ключ API от TMDb
const BASE_URL = `https://api.themoviedb.org/3`; // базовый URL для запросов к API

export const fetchMovies = async (searchTerm = '', page = 1) => {
  try {
    console.log(`api: ${page}`);
    
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`;

    // Отправляем GET-запрос к API
    const response = await fetch(url);

    // Проверяем статус ответа
    if (!response.ok) {
      throw new Error('Ошибка при запросе к API');
    }

    // Преобразуем ответ в JSON
    const data = await response.json();

    // Возвращаем массив фильмов и общее количество страниц
    return {
      results: data.results, // Массив фильмов
      total_pages: data.total_pages, // Общее количество страниц
    };
  } catch (error) {
    console.error('Ошибка', error); // Логируем ошибку в консоль
    return { results: [], total_pages: 1 }; // Возвращаем пустой массив и одну страницу в случае ошибки
  }
};
