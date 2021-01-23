import EditPointForm from '../view/edit-trip-point.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

import {nanoid} from 'nanoid';

export default class PointNew {
  constructor(pointListContainer, destinationsModel, offersModel, changeData, pointsModel) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._possibleDestinations = [];
    this._allOffers = [];

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    //console.log(this._possibleDestinations);
  }

  init() {
    //console.log(this._possibleDestinations);

    if (this._pointEditComponent !== null) {
      this.destroy();
    }

    this._pointEditComponent = new EditPointForm(this._pointsModel.getEmptyPoint(), this._possibleDestinations, this._allOffers);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _renew() {
    //console.log(this._possibleDestinations);
    if (this._pointEditComponent !== null) {
      this.init();
    }
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    this._pointEditComponent.destroyCalendars();
    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    point.id = nanoid(8);

    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this._possibleDestinations = this._destinationsModel.getDestinations();
        this._allOffers = this._offersModel.getOffers();

        if (this._pointEditComponent !== null) {
          this.destroy();
          this.init();
        }
        break;
    }
  }
}
