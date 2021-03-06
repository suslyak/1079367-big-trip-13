import EditPointForm from '../view/edit-trip-point.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNew {
  constructor(pointListContainer, destinationsModel, offersModel, changeData, pointsModel) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._destinations = [];
    this._allOffers = [];
    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    if (this._pointEditComponent !== null) {
      this.destroy();
    }

    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);

    this._getDestinations();
    this._getOffers();

    this._pointEditComponent = new EditPointForm(
        this._pointsModel.getEmptyPoint(),
        this._destinations,
        this._allOffers,
        this._destinationsModel.isLoading(),
        this._offersModel.isLoading()
    );

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    this._destinationsModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);

    this._pointEditComponent.destroyCalendars();
    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  _getDestinations() {
    this._destinations = this._destinationsModel.getDestinations();
  }

  _getOffers() {
    this._allOffers = this._offersModel.getOffers();
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
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
        this._destinations = this._destinationsModel.getDestinations();
        this._allOffers = this._offersModel.getOffers();

        if (this._pointEditComponent !== null) {
          this.destroy();
          this.init();
        }
        break;
    }
  }
}
