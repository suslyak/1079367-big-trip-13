import Sorting from '../view/trip-sort.js';
import Events from '../view/trip-events.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {filter} from '../utils/filter.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UpdateType, UserAction, FilterType} from '../const.js';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._sortingComponent = null;
    this._eventsComponent = null;
    this._pointPresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeSwitch = this._handleModeSwitch.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

  }

  init(sortings) {
    this._points = this._getPoints();
    this._sortings = sortings;
    this._destinations = Array.from(new Set(this._points.map((point) => point.destination.name)));

    const prevSortingComponent = this._sortingComponent;
    const prevEventsComponent = this._eventsComponent;

    this._destinations.sort();

    this._getSort();
    this._eventsComponent = new Events();

    //  предположим, что сортировка перерендериваться без перезагрузки всей страницы не будет
    if (prevSortingComponent === null) {
      this._renderSorting();
    }

    //  Сейчас смысла мало, но вдруг понадобится переинициировать весь список точек
    if (prevEventsComponent === null) {
      this._renderEvents();
      this._renderTripPoints();
      return;
    }

    if (this._tripContainer.contains(prevEventsComponent.getElement())) {
      replace(this._eventsComponent, prevEventsComponent);
      this._renderTripPoints();
    }

    remove(prevEventsComponent);
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

    return filtredPoints;
  }

  _getSort() {
    this._sortingComponent = new Sorting(this._sortings);
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingComponent, RenderPosition.BEFOREEND);
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
    this._pointNewPresenter = new PointNewPresenter(this._eventsComponent, this._handleViewAction);

    for (const point of this._getPoints()) {
      this._renderTripPoint(point);
    }
  }

  _clearTrip() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
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
        this._renderTripPoints();
        break;

      case UpdateType.MAJOR:
        this._clearTrip();
        this._renderTripPoints();
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
