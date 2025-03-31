import { format, parse } from 'date-fns';

export const formatReleaseDate = (date) => {
  if (!date) return 'Release date unknown';
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  return format(dateObj, 'MMMM d, yyyy');
};