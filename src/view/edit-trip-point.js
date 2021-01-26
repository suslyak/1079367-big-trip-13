import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import SmartView from './smart.js';
import {ErrorMessages, ErrorColors, DefaultColors, TripPointTypes} from '../const.js';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

dayjs.extend(customParseFormat);

const getDestinationPictures = (pictures) => {
  return pictures.reduce((destinationsPictureElements, picture) => (
    destinationsPictureElements + `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
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
  constructor(point = {}, destinations = [], offers = [], isDestinationsLoading = false, isOffersLoading = false) {
    super();

    const {
      start = dayjs(),
      end = dayjs(),
      cost = ``
    } = point;

    this._start = start;
    this._end = end;
    this._cost = cost;
    this._destinations = destinations;
    this._offers = offers;
    this._possibleDestinationsNames = this._destinations.map((destination) => destination.name);
    this._isEmpty = (point.id.length === 0);
    this._startDatepicker = null;
    this._endDatepicker = null;

    // В принципе, не обязательно, т.к. в ТЗ может быть открыта одновременно только одна форма,
    // но вдруг это изменится в будущем.
    this._inputId = nanoid(8);

    this._editClickHandler = this._editClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersToggleHandler = this._offersToggleHandler.bind(this);
    this._datePopupCloseHandler = this._datePopupCloseHandler.bind(this);
    this.parsePointToData = this.parsePointToData.bind(this);

    this._data = this.parsePointToData(point);

    this._isDestinationLoading = isDestinationsLoading;
    this._isOffersLoading = isOffersLoading;

    this._isDataLoading = this._isDestinationLoading || this._isOffersLoading;

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  reset(point) {
    this.updateData(
        this.parsePointToData(point)
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
    if (this._possibleDestinationsNames.length) {
      return this._possibleDestinationsNames.reduce((destinationsOptionElements, option) => (
        destinationsOptionElements + `<option value="${option}"></option>`
      ), ``);
    }

    return ``;
  }

  getAvailableTypesTemplate(selectedType) {
    return TripPointTypes.map((type) => {
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
        const isChecked = selectedOffers.some((selectedOffer) => selectedOffer.title === offer.title);
        const isDisabled = offer.title === `loading offers..`;

        return `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-${offerId}" type="checkbox" data-offer-title="${offer.title}" name="event-offer-${offer.name}" ${isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
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
    if (this._isOffersLoading) {
      return `
      <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers loading..</h3>
      </section>`;
    }

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

  _initDestinationInputValue(destination) {
    if (this._isDestinationLoading) {
      return `loading destinations..`;
    }

    return destination.name || ``;
  }

  _createEditPointTemplate(data) {
    const {
      pointType: type = `flight`,
      destination = {},
      selectedOffers,
      availableOffers = this._offers[`flight`],
      isDisabled,
      isSaving,
      isDeleting
    } = data;

    const formDisabled = isDisabled || this._isDataLoading || !this._checkDates();

    const getCancelDeleteButton = () => {
      if (this._isEmpty) {
        return `<button class="event__reset-btn" type="reset">Cancel</button>`;
      }

      return `<button class="event__reset-btn" type="reset" ${formDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>`;
    };

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-${this._inputId}">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._inputId}" type="checkbox" ${this._isDataLoading ? `disabled` : ``}>

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
              <input
                class="event__input  event__input--destination"
                id="event-destination-${this._inputId}"
                type="text" name="event-destination"
                value="${this._initDestinationInputValue(destination)}"
                list="destination-list-${this._inputId}"
                ${this._isDataLoading ? `disabled` : ``}>
              <datalist id="destination-list-${this._inputId}">
                ${this.getDestinationsOptions()}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${this._inputId}">From</label>
              <input class="event__input  event__input--time" id="event-start-time-${this._inputId}" type="text" name="event-start-time" value="${this._start.format(`DD/MM/YY HH:mm`)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-${this._inputId}">To</label>
              <input class="event__input  event__input--time" id="event-end-time-${this._inputId}" type="text" name="event-end-time" value="${this._end.format(`DD/MM/YY HH:mm`)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-${this._inputId}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${this._inputId}" type="text" name="event-price" value="${this._data.cost}" ${this._isDataLoading ? `disabled` : ``}>
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit" ${formDisabled ? `disabled` : ``}>
              ${isSaving ? `Saving...` : `Save`}
            </button>
            ${getCancelDeleteButton()}
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

  _checkDates() {
    return this._data.start.isBefore(this._data.end);
  }

  _setPointTypeChangeHandlers() {
    const pointTypeRadioButtonsContainer = this.getElement().querySelector(`.event__type-list`);

    pointTypeRadioButtonsContainer.addEventListener(`click`, this._pointTypeChangeHandler);
  }

  _setOffersToggleHandler() {
    const offersContainer = this.getElement().querySelector(`.event__available-offers`);
    if (offersContainer) {
      offersContainer.addEventListener(`click`, this._offersToggleHandler);
    }
  }

  _setDestinationChangeHandlers() {
    const destinationInput = this.getElement().querySelector(`.event__input--destination`);

    destinationInput.addEventListener(`change`, this._destinationChangeHandler);
  }

  _setPriceChangeHandlers() {
    const priceInput = this.getElement().querySelector(`.event__input--price`);

    priceInput.addEventListener(`change`, this._priceChangeHandler);
  }

  _setPriceInputHandlers() {
    const priceInput = this.getElement().querySelector(`.event__input--price`);

    priceInput.addEventListener(`input`, this._priceInputHandler);
  }

  // больше не нужно, но вдруг понадобится повесть еще событие
  _setStartDateChangeHandlers() {
    const startDateInput = this.getElement().querySelector(`input[name='event-start-time']`);
    startDateInput.addEventListener(`change`, this._startDateChangeHandler);
  }

  // больше не нужно, но вдруг понадобится повесть еще событие
  _setEndDateChangeHandlers() {
    const endDateInput = this.getElement().querySelector(`input[name='event-end-time']`);

    endDateInput.addEventListener(`change`, this._endDateChangeHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._formSubmitHandler);
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
        availableOffers: (evt.target.value in this._offers) ? this._offers[evt.target.value] : []
      });
    }
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destinationFromValue = this._destinations.find((destination) => destination.name === evt.currentTarget.value);

    if (this._possibleDestinationsNames.some((destinationName) => destinationName === evt.currentTarget.value)) {
      evt.currentTarget.setCustomValidity(``);

      this.updateData({
        destination: destinationFromValue || {}
      });
    } else {
      evt.currentTarget.setCustomValidity(ErrorMessages.WRONG_DESTINATION);
      evt.currentTarget.reportValidity();
    }
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();

    evt.target.value = evt.target.value.replace(/\D/g, ``); // на случай смены value кулхацкером не через ввод в инпут
    this.updateData({
      cost: evt.target.value
    }, true);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    evt.target.value = evt.target.value.replace(/\D/g, ``);
  }

  _offersToggleHandler(evt) {
    if (evt.target && evt.target.matches(`input[type='checkbox']`)) {
      if (!evt.target.checked) {
        this._data.selectedOffers = this._data.selectedOffers.filter((offer) => offer.title !== evt.target.getAttribute(`data-offer-title`));
      } else {
        this._data.selectedOffers.push(this._offers[this._data.pointType].find((offer) => offer.title === evt.target.getAttribute(`data-offer-title`)));
      }
    }
  }

  _startDateChangeHandler() {
    const inputValue = this._startDatepicker.input.value;

    this.updateData({
      start: dayjs(inputValue, `DD/MM/YY hh:mm`)
    }, true);
  }

  _endDateChangeHandler() {
    const inputValue = this._endDatepicker.input.value;

    this.updateData({
      end: dayjs(inputValue, `DD/MM/YY HH:mm`)
    }, true);
  }

  _datePopupCloseHandler() {
    const datesInputs = this.getElement().querySelectorAll(`.event__input--time`);

    if (!this._checkDates()) {
      this.getElement().querySelector(`.event__save-btn`).disabled = true;

      datesInputs.forEach((input) => {
        input.style.color = ErrorColors.INPUT;
      });
    } else {
      this.getElement().querySelector(`.event__save-btn`).disabled = false;

      datesInputs.forEach((input) => {
        input.style.color = DefaultColors.INPUT;
      });
    }
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this.parseDataToPoint(this._data));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submitClick(this.parseDataToPoint(this._data));

    return;
  }

  _setInnerHandlers() {
    this._setPointTypeChangeHandlers();
    this._setDestinationChangeHandlers();
    this._setPriceChangeHandlers();
    this._setPriceInputHandlers();
    this._setOffersToggleHandler();
  }

  setEditClickHandler(callback) {
    const editButton = this.getElement().querySelector(`.event__rollup-btn`);
    this._callback.editClick = callback;

    if (editButton) {
      editButton.addEventListener(`click`, this._editClickHandler);
    }
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    const dateInput = this.getElement().querySelector(`input[name='event-start-time']`);

    this._startDatepicker = flatpickr(
        dateInput,
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.start.format(`DD/MM/YY HH:mm`),
          enableTime: true,
          onChange: this._startDateChangeHandler,
          onClose: this._datePopupCloseHandler,
          errorHandler: () => {
            return;
          }
        }
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    const dateInput = this.getElement().querySelector(`input[name='event-end-time']`);

    this._endDatepicker = flatpickr(
        dateInput,
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.end.format(`DD/MM/YY HH:mm`),
          enableTime: true,
          onChange: this._endDateChangeHandler,
          onClose: this._datePopupCloseHandler,
          errorHandler: () => {
            return;
          }
        }
    );
  }

  destroyCalendars() {
    this._startDatepicker.destroy();
    this._endDatepicker.destroy();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setEditClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setFormSubmitHandler(this._callback.submitClick);
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          availableOffers: this._offers[point.pointType] || [],
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  parseDataToPoint(data) {
    data = Object.assign({}, data);
    data.cost = data.cost !== `` ? parseInt(data.cost, 10) : 0;

    delete data.availableOffers;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
