import AbstractView from './abstract.js';
import {POINT_TYPES} from '../mock/trip-point.js';

import dayjs from 'dayjs';

const getOffers = (selectedOffers) => {
  return selectedOffers.reduce((offersListElements, offer) => (
    offersListElements + `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
    </li>`
  ), ``);
};

const getOffersTemplate = (selectedOffers) => {
  if (selectedOffers.length) {
    return `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffers(selectedOffers)}
      </ul>`;
  }

  return ``;
};

export default class TripPoint extends AbstractView {
  constructor(point = {}) {
    super();

    const {
      pointType = POINT_TYPES[5],
      selectedOffers = [],
      destination = {},
      start = dayjs(),
      end = dayjs(),
      cost = ``,
      favorite = false,
    } = point;

    this._type = pointType;
    this._selectedOffers = selectedOffers;
    this._destination = destination;
    this._start = start;
    this._end = end;
    this._cost = cost;
    this._favorite = favorite;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getDuration(start = this._start, end = this._end) {
    const termDays = end.diff(start, `days`);
    const termHours = end.diff(start, `hours`) - termDays * 24;
    const termMinutes = end.diff(start, `minutes`) - (termHours + termDays * 24) * 60;
    return [
      termDays ? `${termDays.toString().padStart(2, `0`)}D` : ``,
      (termDays || termHours) ? `${termHours.toString().padStart(2, `0`)}H` : ``,
      `${termMinutes.toString().padStart(2, `0`)}M`
    ]
    .filter((term) => term).join(` `);
  }

  _createPointTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event">
        <time class="event__date" datetime="${this._start.format(`YYYY-MM-DDTHH:mm`)}">${this._start.format(`MMM DD`)}</time>
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._type} ${this._destination.name ? this._destination.name : `nowhere`}</h3>
        <div class="event__schedule">
            <p class="event__time">
            <time class="event__start-time" datetime="${this._start.format(`YYYY-MM-DDTHH:mm`)}">${this._start.format(`HH:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${this._end.format(`YYYY-MM-DDTHH:mm`)}">${this._end.format(`HH:mm`)}</time>
            </p>
            <p class="event__duration">${this.getDuration(this._start, this._end)}</p>
        </div>
        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._cost}</span>
        </p>
          ${getOffersTemplate(this._selectedOffers)}
        <button class="event__favorite-btn ${this._favorite ? `event__favorite-btn--active` : `` }" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
        </button>
        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
        </div>
      </li>`;
  }

  getTemplate() {
    return this._createPointTemplate();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-icon`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
