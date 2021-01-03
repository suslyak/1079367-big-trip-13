import Sorting from '../view/trip-sort.js';
import Events from '../view/trip-events.js';
import PointPresenter from './point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._sortingComponent = null;
    this._eventsComponent = null;
  }

  init(points, sortings) {
    this._points = points;
    this._sortings = sortings;

    const prevSortingComponent = this._sortingComponent;
    const prevEventsComponent = this._eventsComponent;

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

  destroy() {
    remove(this._sortingComponent);
    remove(this._eventsComponent);
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
    const destinations = Array.from(new Set(this._points.map((point) => point.destination.name)));
    const piontPresenter = new PointPresenter(this._eventsComponent);

    destinations.sort();
    piontPresenter.init(tripPoint, destinations);
  }

  _renderTripPoints() {
    for (const point of this._points) {
      this._renderTripPoint(point);
    }
  }
}
