import Sorting from '../view/trip-sort.js';
import Events from '../view/trip-events.js';
import NoPoints from '../view/no-points.js';
import Loading from "../view/loading.js";
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import {filter} from '../utils/filter.js';
import {sortings} from '../utils/sorting.js';
import {SortType} from '../const.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UpdateType, UserAction, FilterType} from '../const.js';

export default class Trip {
  constructor(tripContainer, pointsModel, destinationsModel, offersModel, filterModel, api) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._noPointsComponent = null;
    this._sortingComponent = null;
    this._eventsComponent = null;
    this._loadingComponent = new Loading();
    this._pointPresenter = {};
    this._pointNewPresenter = null;
    this._currentSorting = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeSwitch = this._handleModeSwitch.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    const prevEventsComponent = this._eventsComponent;

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    if (prevEventsComponent === null) {
      this._eventsComponent = new Events();
      this._renderEvents();
    }

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    remove(this._noPointsComponent);

    const prevSortingComponent = this._sortingComponent;

    this._sortingComponent = new Sorting(this._currentSorting);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevSortingComponent === null) {
      this._renderSorting();
    }

    if (prevSortingComponent !== null && this._tripContainer.contains(prevSortingComponent.getElement())) {
      replace(this._sortingComponent, prevSortingComponent);
    }

    this._renderTripPoints();

    remove(prevSortingComponent);
  }

  createPoint() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  destroy() {
    this._clearTrip({resetSorting: true});
    remove(this._sortingComponent);
    remove(this._eventsComponent);

    this._eventsComponent = null;
    this._sortingComponent = null;
    this._pointNewPresenter = null;
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    Object.values(sortings).find((sorting) => sorting.name === this._currentSorting).result(filtredPoints);

    return filtredPoints;
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvents() {
    render(this._tripContainer, this._eventsComponent, RenderPosition.BEFOREEND);
  }

  _renderTripPoint(tripPoint) {
    const pointPresenter = new PointPresenter(this._eventsComponent, this._destinationsModel, this._offersModel, this._handleViewAction, this._handleModeSwitch);
    pointPresenter.init(tripPoint);
    this._pointPresenter[tripPoint.id] = pointPresenter;
  }

  _renderTripPoints() {
    if (this._pointNewPresenter === null) {
      this._pointNewPresenter = new PointNewPresenter(this._eventsComponent, this._destinationsModel, this._offersModel, this._handleViewAction, this._pointsModel);
    }

    if (!this._pointsModel.getPoints().length) {
      remove(this._noPointsComponent);

      this._noPointsComponent = new NoPoints();

      render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);

      return;
    }

    for (const point of this._getPoints()) {
      this._renderTripPoint(point);
    }
  }

  _renderLoading() {
    render(this._eventsComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTrip({resetSorting = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    remove(this._loadingComponent);

    if (resetSorting) {
      this._currentSorting = SortType.DAY;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSorting === sortType) {
      return;
    }

    this._currentSorting = sortType;

    this._clearTrip();
    this.init();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updateTripPoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;

      case UpdateType.MINOR:
        this._clearTrip();
        this.init();
        break;

      case UpdateType.MAJOR:
        this._clearTrip({resetSorting: true});
        this.init();
        break;

      case UpdateType.INIT:
        this._isLoading = false;

        remove(this._loadingComponent);

        this.init();
        break;
    }
  }

  _handleModeSwitch() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetViewToDefault());
  }
}
