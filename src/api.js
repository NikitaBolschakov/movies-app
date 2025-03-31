const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = `https://api.themoviedb.org/3`; // базовый URL для запросов к API

export const fetchMovies = async (searchTerm = '', page = 1) => {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`;

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

export const createGuestSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`);

    if (!response.ok) {
      throw new Error('Ошибка при создании гостевой сессии');
    }

    const data = await response.json();
    return data.guest_session_id; // Возвращаем ID гостевой сессии
  } catch (error) {
    console.error('Ошибка при создании гостевой сессии:', error);
    return null;
  }
};

// Запрос жанров
export const fetchGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  if (!response.ok) {
    throw new Error('Ошибка при загрузке жанров');
  }
  return response.json();
};

export const fetchRatedMovies = async (sessionId) => {
  if (!sessionId) {
    console.error('Гостевая сессия не создана');
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}`);

    if (!response.ok) {
      if (response.status === 404) {
        // Нет оцененных фильмов — это нормально
        return [];
      }
      // Если это не 404, выбрасываем ошибку
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Ошибка при получении оцененных фильмов:', error);
    return [];
  }
};

export const rateMovie = async (id, sessionId, value) => {
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
  if (!response.ok) throw new Error('Не удалось отправить рейтинг');
};
