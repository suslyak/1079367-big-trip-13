import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import SmartView from './smart.js';

import {POINT_TYPES} from '../mock/trip-point.js';
import {OFFERS, DESTINATIONS} from '../mock/trip-point.js';

const getDestinationPictures = (pictures) => {
  return pictures.reduce((destinationsPictureElements, picture) => (
    destinationsPictureElements + `<img class="event__photo" src="${picture}" alt="Event photo">`
  ), ``);
};

const getPicturesTemplate = (destination) => {
  if (destination.description.pictures.length) {
    return `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${getDestinationPictures(destination.description.pictures)}
        </div>
      </div>`;
  }

  return ``;
};

const getDestinationInfoTemplate = (destination) => {
  if (Object.keys(destination).length) {
    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description.text}</p>
        ${getPicturesTemplate(destination)}
      </section>`;
  }

  return ``;
};

export default class EditPointForm extends SmartView {
  constructor(point = {}, destinationsAvailable = []) {
    super();

    const {
      pointType = POINT_TYPES[5],
      offers = [],
      destination = {},
      start = dayjs(),
      end = dayjs(),
      cost = ``
    } = point;

    this._type = pointType;
    this._offers = offers;
    this._destination = destination;
    this._start = start;
    this._end = end;
    this._cost = cost;
    this._possibleDestinations = destinationsAvailable;
    this._isEmpty = Object.keys(point).length === 0;
    this._data = EditPointForm.parsePointToData(point);

    // В принципе, не обязательно, т.к. в ТЗ может быть открыта одновременно только одна форма,
    // но вдруг это изменится в будущем.
    this._idForInputs = nanoid(8);

    this._editClickHandler = this._editClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);

    this._setPointTypeChangeHandlers();
    this._setDestinationChangeHandlers();
  }

  reset(point) {
    this.updateData(
        EditPointForm.parsePointToData(point)
    );
  }

  drawRollUpButton() {
    if (!this._isEmpty) {
      return `
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`;
    }

    return ``;
  }

  getDestinationsOptions() {
    if (this._possibleDestinations.length) {
      return this._possibleDestinations.reduce((destinationsOptionElements, option) => (
        destinationsOptionElements + `<option value="${option}"></option>`
      ), ``);
    }

    return ``;
  }

  getAvailableTypesTemplate() {
    return POINT_TYPES.reduce((typesInputElements, type) => (
      typesInputElements + `
        <div class="event__type-item">
          <input id="event-type-${type}-${this._idForInputs}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${this._idForInputs}">${type}</label>
        </div>`
    ), ``);
  }

  getOffers(offers, availableOffers) {
    let checked = Boolean;

    if (availableOffers.length) {
      return availableOffers.map((offer) => {
        const offerIndex = nanoid(8);
        checked = (offers.indexOf(offer.id) >= 0) ? true : false;

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
  }

  getOffersTemplate(offers, availableOffers) {
    if (availableOffers.length) {
      return `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${this.getOffers(offers, availableOffers)}
          </div>
        </section>`;
    }

    return ``;
  }

  _createEditPointTemplate(data) {
    const {pointType: type, destination, offers, availableOffers} = data;

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-${this._idForInputs}">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._idForInputs}" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${this.getAvailableTypesTemplate()}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-${this._idForInputs}">
                ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-${this._idForInputs}" type="text" name="event-destination" value="${destination.name ? destination.name : ``}" list="destination-list-${this._idForInputs}">
              <datalist id="destination-list-${this._idForInputs}">
                ${this.getDestinationsOptions()}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${this._idForInputs}">From</label>
              <input class="event__input  event__input--time" id="event-start-time-${this._idForInputs}" type="text" name="event-start-time" value="${this._start.format(`DD/MM/YY hh:mm`)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-${this._idForInputs}">To</label>
              <input class="event__input  event__input--time" id="event-end-time-${this._idForInputs}" type="text" name="event-end-time" value="${this._end.format(`DD/MM/YY hh:mm`)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-${this._idForInputs}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${this._idForInputs}" type="text" name="event-price" value="${this._cost}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">${this._isEmpty ? `Cancel` : `Delete`}</button>
            ${this.drawRollUpButton()}
          </header>
          <section class="event__details">
            ${this.getOffersTemplate(offers, availableOffers)}
            ${getDestinationInfoTemplate(destination)}
          </section>
        </form>
      </li>`;
  }

  getTemplate() {
    return this._createEditPointTemplate(this._data);
  }

  _setPointTypeChangeHandlers() {
    const pointTypeRadioButtons = this.getElement().querySelectorAll(`.event__type-input`);

    pointTypeRadioButtons.forEach((button) => {
      button.addEventListener(`click`, this._pointTypeChangeHandler);
    });
  }

  _setDestinationChangeHandlers() {
    const destinationInput = this.getElement().querySelector(`.event__input--destination`);

    destinationInput.addEventListener(`change`, this._destinationChangeHandler);
  }


  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _pointTypeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      pointType: evt.currentTarget.value,
      offers: [],
      availableOffers: (evt.currentTarget.value in OFFERS) ? OFFERS[evt.currentTarget.value] : []
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destinationFromValue = DESTINATIONS.filter((destination) => destination.name === evt.currentTarget.value);
    this.updateData({
      destination: destinationFromValue.length ? destinationFromValue[0] : {}
    });

  }

  _setInnerHandlers() {
    this._setPointTypeChangeHandlers();
    this._setDestinationChangeHandlers();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setEditClickHandler(this._callback.editClick);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          offers: point.offers.map((offer) => offer.id),
          availableOffers: OFFERS[point.pointType] ? OFFERS[point.pointType] : []
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    data.offers = [];

    delete data.availableOffers;

    return data;
  }
}
