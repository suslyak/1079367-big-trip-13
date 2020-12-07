import dayjs from 'dayjs';

export const getTripInfoTemplate = (pointsNames = [`...`, `...`], dates = {start: dayjs(), end: dayjs()}) => {
  const generateTripNames = () => {
    return pointsNames.join(` &mdash; `);
  };
  const generateTripDates = () => {
    if ((dates.start.year() === dates.end.year()) && (dates.start.month() === dates.end.month())) {
      return `${dates.start.format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dates.end.format(`DD`)}`;
    }
    return `${dates.start.format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dates.end.format(`MMM DD`)}`;
  };

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${generateTripNames()}</h1>
        <p class="trip-info__dates">${generateTripDates()}</p>
      </div>
    </section>`;
};
