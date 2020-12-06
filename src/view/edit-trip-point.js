import dayjs from 'dayjs';
import {POINT_TYPES} from '../mock/trip-point.js';

// from you dont need lodash underscore
export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getEditPointTemplate = (point = {}, destinationsAvailable = []) => {
  const isEmpty = Object.keys(point).length === 0;
  const {
    eventType = POINT_TYPES[5],
    eventTypeIcon = POINT_TYPES[5].iconSrc,
    offers = POINT_TYPES[5].offers,
    destination = {},
    startDate = dayjs(),
    endDate = dayjs(),
    cost = ``
  } = point;

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
    let destinationsOptionElements = ``;
    if (destinationsAvailable.length > 0) {
      for (const option of destinationsAvailable) {
        destinationsOptionElements += `<option value="${option.name}"></option>`;
      }
    }

    return destinationsOptionElements;
  };

  const getDestinationInfo = () => {
    if (Object.keys(destination).length > 0) {
      return `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description.text}</p>
          ${getDestinationPictures()}
        </section>`;
    }

    return ``;
  };

  const getDestinationPictures = () => {
    let destinationsPictureElements = ``;
    if (destination.description.pictures.length > 0) {
      let destinationPictures = destination.description.pictures;
      destinationsPictureElements += `<div class="event__photos-container"><div class="event__photos-tape">`;

      for (const picture of destinationPictures) {
        destinationsPictureElements += `<img class="event__photo" src="${picture}" alt="Event photo">`;
      }

      destinationsPictureElements += `</div></div>`;
    }

    return destinationsPictureElements;
  };

  const getOffers = () => {
    let offersElements = ``;
    let checked = Boolean;

    if (offers.length > 0) {
      offersElements += `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">`;

      let offerIndex = 1;
      for (const offer of offers) {
        checked = isEmpty ? !isEmpty : Boolean(randomInt(0, 1));

        offersElements += `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-${offerIndex}" type="checkbox" name="event-offer-${offer.name}" ${checked ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${offer.name}-${offerIndex}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.cost}</span>
            </label>
          </div>`;

        offerIndex++;
      }

      offersElements += `</div></section>`;
    }

    return offersElements;
  };

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${eventTypeIcon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                  <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventType.title}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name ? destination.name : ``}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationsOptions()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate.format(`DD/MM/YY hh:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate.format(`DD/MM/YY hh:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${ isEmpty ? `Cancel` : `Delete`}</button>
          ${drawRollUpButton()}
        </header>
        <section class="event__details">
          ${getOffers()}
          ${getDestinationInfo()}
        </section>
      </form>
    </li>`;
};
