import TripInfo from '../view/trip-info.js';
import TripCost from '../view/trip-cost.js';
import Menu from '../view/main-menu.js';
import Filter from '../view/trip-filters.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Info {
  constructor(tripInfoContainer, tripControlsContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripMenuContainer = tripControlsContainer[`menu`];
    this._tripFilterContainer = tripControlsContainer[`filter`];
    this._tripInfoComponent = new TripInfo();
    this._tripCostComponent = new TripCost();
    this._menuComponent = new Menu();
    this._filterComponent = new Filter();
  }

  init(points, menulinks, filters) {
    this._points = points;
    this._menulinks = menulinks;
    this._filters = filters;

    this._getCost();
    this._getInfo();
    this._getMenu();
    this._getFilter();

    this._renderInfo();
    this._renderCost();
    this._renderMenu();
    this._renderFilter();
  }

  _getCost() {
    this._tripCostComponent = new TripCost(this._points.reduce((total, point) => total + point.cost, 0));
  }

  _getInfo() {
    const tripDestinationsGraph = Array.from(new Set(this._points.map((point) => point.destination.name)));
    const tripTimeGap = {
      start: this._points[0].start,
      end: this._points.slice(-1)[0].end
    };

    this._tripInfoComponent = new TripInfo(tripDestinationsGraph, tripTimeGap);
  }

  _getMenu() {
    this._menuComponent = new Menu(this._menulinks);
  }

  _getFilter() {
    this._filterComponent = new Filter(this._filters);
  }

  _renderInfo() {

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCost() {
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderMenu() {
    const container = this._tripMenuContainer[`container`];
    const position = this._tripMenuContainer[`referenceElement`] ? this._tripMenuContainer[`referenceElement`] : RenderPosition.BEFOREEND;

    render(container, this._menuComponent, position);
  }

  _renderFilter() {
    render(this._tripFilterContainer, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
