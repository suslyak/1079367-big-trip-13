import EditPointForm from '../view/edit-trip-point.js';
import TripPoint from '../view/trip-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';


const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Point {
  constructor(tripContainer, destinationsModel, offersModel, changeData, switchMode) {
    this._tripContainer = tripContainer;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._changeData = changeData;
    this._switchMode = switchMode;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._destinations = [];
    this._allOffers = [];

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
  }

  init(point) {
    this._point = point;
    this._destinations = this._destinationsModel.getDestinations();
    this._allOffers = this._offersModel.getOffers();

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._pointEditComponent;

    this._pointComponent = new TripPoint(this._point);
    this._pointEditComponent = new EditPointForm(
        this._point,
        this._destinations,
        this._allOffers,
        this._destinationsModel.isLoading(),
        this._offersModel.isLoading());

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setEditClickHandler(this._handleCloseEditClick);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    this._destinationsModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
    this._pointEditComponent.destroyCalendars();

    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._switchMode();

    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._mode = Mode.DEFAULT;
  }

  resetViewToDefault() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;

      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;

      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleCloseEditClick() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._point,
            {
              favorite: !this._point.favorite
            }
        )
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this.init(this._point);
        break;
    }
  }
}
