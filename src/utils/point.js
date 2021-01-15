import dayjs from 'dayjs';

export const getDuration = (start = dayjs(), end = dayjs()) => {
  const termDays = end.diff(start, `days`);
  const termHours = end.diff(start, `hours`) - termDays * 24;
  const termMinutes = end.diff(start, `minutes`) - (termHours + termDays * 24) * 60;
  return [
    termDays ? `${termDays.toString().padStart(2, `0`)}D` : ``,
    (termDays || termHours) ? `${termHours.toString().padStart(2, `0`)}H` : ``,
    `${termMinutes.toString().padStart(2, `0`)}M`
  ]
  .filter((term) => term).join(` `);
};
