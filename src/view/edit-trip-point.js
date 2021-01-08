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
      start = dayjs(),
      end = dayjs(),
      cost = ``
    } = point;

    this._type = pointType;
    this._start = start;
    this._end = end;
    this._cost = cost;
    this._possibleDestinations = destinationsAvailable;
    this._isEmpty = Object.keys(point).length === 0;
    this._data = EditPointForm.parsePointToData(point);

    // В принципе, не обязательно, т.к. в ТЗ может быть открыта одновременно только одна форма,
    // но вдруг это изменится в будущем.
    this._inputId = nanoid(8);

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

  getAvailableTypesTemplate(selectedType) {
    return POINT_TYPES.map((type) => {
      const isChecked = type === selectedType;

      return `
        <div class="event__type-item">
          <input id="event-type-${type}-${this._inputId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${this._inputId}">${type}</label>
        </div>`;
    }).join(``);
  }

  getOffers(availableOffers, selectedOffers) {
    if (availableOffers.length) {
      return availableOffers.map((offer) => {
        const offerId = nanoid(8);
        const isChecked = selectedOffers.some((selectedOffer) => selectedOffer.id === offer.id);

        return `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-${offerId}" type="checkbox" name="event-offer-${offer.name}" ${isChecked ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${offer.name}-${offerId}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.cost}</span>
            </label>
          </div>`;
      }).join(``);
    }

    return ``;
  }

  getOffersTemplate(availableOffers, selectedOffers) {
    if (availableOffers.length) {
      return `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${this.getOffers(availableOffers, selectedOffers)}
          </div>
        </section>`;
    }

    return ``;
  }

  _createEditPointTemplate(data) {
    const {pointType: type, destination, selectedOffers, availableOffers} = data;

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-${this._inputId}">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._inputId}" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${this.getAvailableTypesTemplate(type)}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-${this._inputId}">
                ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-${this._inputId}" type="text" name="event-destination" value="${destination.name ? destination.name : ``}" list="destination-list-${this._inputId}">
              <datalist id="destination-list-${this._inputId}">
                ${this.getDestinationsOptions()}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${this._inputId}">From</label>
              <input class="event__input  event__input--time" id="event-start-time-${this._inputId}" type="text" name="event-start-time" value="${this._start.format(`DD/MM/YY hh:mm`)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-${this._inputId}">To</label>
              <input class="event__input  event__input--time" id="event-end-time-${this._inputId}" type="text" name="event-end-time" value="${this._end.format(`DD/MM/YY hh:mm`)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-${this._inputId}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${this._inputId}" type="text" name="event-price" value="${this._cost}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">${this._isEmpty ? `Cancel` : `Delete`}</button>
            ${this.drawRollUpButton()}
          </header>
          <section class="event__details">
            ${this.getOffersTemplate(availableOffers, selectedOffers)}
            ${getDestinationInfoTemplate(destination)}
          </section>
        </form>
      </li>`;
  }

  getTemplate() {
    return this._createEditPointTemplate(this._data);
  }

  _setPointTypeChangeHandlers() {
    const pointTypeRadioButtonsContainer = this.getElement().querySelector(`.event__type-list`);

    pointTypeRadioButtonsContainer.addEventListener(`click`, this._pointTypeChangeHandler);
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
    if (evt.target && evt.target.matches(`input[type='radio']`)) {
      evt.target.checked = true;
      this.updateData({
        pointType: evt.target.value,
        selectedOffers: [],
        availableOffers: (evt.currentTarget.value in OFFERS) ? OFFERS[evt.currentTarget.value] : []
      });
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destinationFromValue = DESTINATIONS.find((destination) => destination.name === evt.currentTarget.value);
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
          availableOffers: OFFERS[point.pointType] ? OFFERS[point.pointType] : []
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.availableOffers;

    return data;
  }
}
