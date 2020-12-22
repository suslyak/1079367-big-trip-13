import dayjs from 'dayjs';
import AbstractView from './abstract.js';


export default class TripInfo extends AbstractView {
  constructor(destinations = [`...`, `...`], time = {start: dayjs(), end: dayjs()}) {
    super();
    this._destinations = destinations.join(` &mdash; `);
    this._time = time;
  }

  getTripDates() {
    const dates = this._time;

    if ((dates.start.year() === dates.end.year()) && (dates.start.month() === dates.end.month())) {
      return `${dates.start.format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dates.end.format(`DD`)}`;
    }
    return `${dates.start.format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dates.end.format(`MMM DD`)}`;
  }

  getTemplate() {
    return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${this._destinations}</h1>
          <p class="trip-info__dates">${this.getTripDates()}</p>
        </div>
      </section>`;
  }
}
