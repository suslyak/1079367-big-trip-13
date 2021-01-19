import Sorting from '../view/trip-sort.js';
import Events from '../view/trip-events.js';
import NoPoints from '../view/no-points.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {filter} from '../utils/filter.js';
import {sortings} from '../utils/sorting.js';
import {SortType} from '../const.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UpdateType, UserAction, FilterType} from '../const.js';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._noPointsComponent = null;
    this._sortingComponent = null;
    this._eventsComponent = null;
    this._pointPresenter = {};
    this._currentSorting = SortType.DAY;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeSwitch = this._handleModeSwitch.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);


    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

  }

  init() {
    const prevEventsComponent = this._eventsComponent;

    if (prevEventsComponent === null) {
      this._eventsComponent = new Events();
      this._renderEvents();

    }

    if (!this._pointsModel.getPoints().length) {
      remove(this._noPointsComponent);

      if (this._pointNewPresenter) {
        this._pointNewPresenter.destroy();
      }

      this._noPointsComponent = new NoPoints();

      this._pointNewPresenter = new PointNewPresenter(this._eventsComponent, this._handleViewAction, this._pointsModel);
      render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);

      return;
    }

    remove(this._noPointsComponent);
    this._points = this._getPoints(); // потом переедет в функцию рендера, сейчас временно вызывается дважды
    this._sortings = Object.values(sortings);
    this._destinations = Array.from(new Set(this._points.map((point) => point.destination.name)));

    const prevSortingComponent = this._sortingComponent;

    this._destinations.sort();

    this._sortingComponent = new Sorting(this._currentSorting);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevSortingComponent === null) {
      this._renderSorting();
      this._renderTripPoints();
      return;
    }

    if (this._tripContainer.contains(prevSortingComponent.getElement())) {
      replace(this._sortingComponent, prevSortingComponent);
      this._renderTripPoints();
    }

    remove(prevSortingComponent);
  }

  createPoint() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(this._destinations);
  }

  destroy() {
    remove(this._sortingComponent);
    remove(this._eventsComponent);
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
    const piontPresenter = new PointPresenter(this._eventsComponent, this._handleViewAction, this._handleModeSwitch);

    piontPresenter.init(tripPoint, this._destinations);
    this._pointPresenter[tripPoint.id] = piontPresenter;
  }

  _renderTripPoints() {
    this._pointNewPresenter = new PointNewPresenter(this._eventsComponent, this._handleViewAction, this._pointsModel);

    for (const point of this._getPoints()) {
      this._renderTripPoint(point);
    }
  }

  _clearTrip({resetSorting = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

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
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data, this._destinations);
        break;

      case UpdateType.MINOR:
        this._clearTrip();
        this.init();
        break;

      case UpdateType.MAJOR:
        this._clearTrip({resetSorting: true});
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
