import EditPointForm from '../view/edit-trip-point.js';
import TripPoint from '../view/trip-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';


export default class Point {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._possibleDestinations = [];
    this._pointComponent = null;
    this._editPointComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, possibleDestiantions = []) {
    this._point = point;
    this._possibleDestinations = possibleDestiantions;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new TripPoint(this._point);
    this._editPointComponent = new EditPointForm(this._point, this._possibleDestinations);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editPointComponent.setEditClickHandler(this._handleCloseEditClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._tripContainer.contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._tripContainer.contains(prevEditPointComponent.getElement())) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _replacePointToForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleCloseEditClick() {
    this._replaceFormToPoint();
  }
}
