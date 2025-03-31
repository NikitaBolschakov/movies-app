import { useEffect, useState } from 'react';
import { createGuestSession } from '../api'; 

export const useGuestSession = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const fetchGuestSession = async () => {
      const savedSessionId = localStorage.getItem('guestSessionId'); // Получаем sessionId из localStorage
      if (savedSessionId) {
        setSessionId(savedSessionId); // Используем сохраненный sessionId
      } else {
        try {
          const dataSessionId = await createGuestSession(); // Создаем новую гостевую сессию
          if (dataSessionId) {
            setSessionId(dataSessionId); // Сохраняем в состояние
            localStorage.setItem('guestSessionId', dataSessionId); // Сохраняем в localStorage
          }
        } catch (error) {
          console.error('Ошибка при создании гостевой сессии:', error);
        }
      }
    };

    fetchGuestSession();
  }, []);

  return sessionId;
};