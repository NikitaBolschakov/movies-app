export const getPosterUrl = (img) => {
  return img
    ? `https://image.tmdb.org/t/p/w500${img}`
    : 'https://imgholder.ru/183x281/8493a8/adb9ca&text=NO+IMAGE&font=kelson&fz=40';
};