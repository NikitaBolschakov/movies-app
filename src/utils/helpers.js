// Обрезка описания фильма
export const truncateDescription = (description) => {
  if (description.length > 100) {
    const truncatedText = description.substring(0, 100);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    const res = truncatedText.substring(0, lastSpaceIndex) + '...';
    return res;
  }
  return description;
};

 // Функция для определения цвета круга в зависимости от рейтинга
 export const getRatingColor = (voteAverage) => {
  if (voteAverage >= 0 && voteAverage < 3) return '#E90000';
  if (voteAverage >= 3 && voteAverage < 5) return '#E97E00';
  if (voteAverage >= 5 && voteAverage < 7) return '#E9D100';
  if (voteAverage >= 7) return '#66E900';
  return '#E90000';
};