import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

import {POINT_TYPES} from '../mock/trip-point.js';
import {OFFERS} from '../mock/trip-point.js';

import {randomInt} from '../utils.js';

export const getEditPointTemplate = (point = {}, destinationsAvailable = []) => {
  const isEmpty = Object.keys(point).length === 0;
  const {
    pointType = POINT_TYPES[5],
    offers = OFFERS[pointType],
    destination = {},
    startDate = dayjs(),
    endDate = dayjs(),
    cost = ``
  } = point;

  // В принципе, не обязательно, т.к. в ТЗ может быть открыта одновременно только одна форма,
  // но вдруг это изменится в будущем.
  const idForInputs = nanoid(8);

  const drawRollUpButton = () => {
    if (!isEmpty) {
      return `
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`;
    }

    return ``;
  };

  const getDestinationsOptions = () => {
    if (destinationsAvailable.length > 0) {
      return destinationsAvailable.reduce((destinationsOptionElements, option) => (
        destinationsOptionElements + `<option value="${option}"></option>`
      ), ``);
    }

    return ``;
  };

  const getDestinationPictures = () => {
    if (destination.description.pictures.length > 0) {
      return destination.description.pictures.reduce((destinationsPictureElements, picture) => (
        destinationsPictureElements + `<img class="event__photo" src="${picture}" alt="Event photo">`
      ), ``);
    }

    return ``;
  };

  const getPicturesTemplate = () => {
    if (destination.description.pictures.length > 0) {
      return `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${getDestinationPictures()}
        </div>
      </div>`;
    }

    return ``;
  };

  const getDestinationInfo = () => {
    if (Object.keys(destination).length > 0) {
      return `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description.text}</p>
          ${getPicturesTemplate()}
        </section>`;
    }

    return ``;
  };

  const getOffers = () => {
    let checked = Boolean;

    if (offers.length > 0) {
      return offers.map((offer) => {
        let offerIndex = nanoid(8);
        checked = isEmpty ? !isEmpty : Boolean(randomInt(0, 1));

        return `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-${offerIndex}" type="checkbox" name="event-offer-${offer.name}" ${checked ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${offer.name}-${offerIndex}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.cost}</span>
            </label>
          </div>`;
      }).join(``);
    }

    return ``;
  };

  const getOffersTemplate = () => {
    if (offers.length > 0) {
      return `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${getOffers()}
          </div>
        </section>`;
    }

    return ``;
  };

  const drowAvailableTypes = () => {
    return POINT_TYPES.reduce((typesInputElements, type) => (
      typesInputElements + `
        <div class="event__type-item">
          <input id="event-type-${type}-${idForInputs}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${idForInputs}">${type.slice(0, 1).toUpperCase() + type.slice(1)}</label>
        </div>`
    ), ``);
  };

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${idForInputs}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${idForInputs}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${drowAvailableTypes()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${idForInputs}">
              ${pointType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${idForInputs}" type="text" name="event-destination" value="${destination.name ? destination.name : ``}" list="destination-list-${idForInputs}">
            <datalist id="destination-list-${idForInputs}">
              ${getDestinationsOptions()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${idForInputs}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${idForInputs}" type="text" name="event-start-time" value="${startDate.format(`DD/MM/YY hh:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${idForInputs}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${idForInputs}" type="text" name="event-end-time" value="${endDate.format(`DD/MM/YY hh:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${idForInputs}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${idForInputs}" type="text" name="event-price" value="${cost}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isEmpty ? `Cancel` : `Delete`}</button>
          ${drawRollUpButton()}
        </header>
        <section class="event__details">
          ${getOffersTemplate()}
          ${getDestinationInfo()}
        </section>
      </form>
    </li>`;
};
