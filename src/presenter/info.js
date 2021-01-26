import dayjs from 'dayjs';

import TripInfo from '../view/trip-info.js';
import TripCost from '../view/trip-cost.js';
import FilterPresenter from '../presenter/filter.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Info {
  constructor(tripInfoContainer, tripControlsContainer, pointsModel, filterModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripFilterContainer = tripControlsContainer[`filter`];
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripInfoComponent = new TripInfo();
    this._tripCostComponent = new TripCost();
  }

  init() {
    this._points = this._getPoints();
    this._getCost();
    this._getInfo();

    this._renderInfo();
    this._renderCost();
    this._renderFilter();
  }

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _getCost() {
    this._tripCostComponent = new TripCost(this._points.reduce((total, point) => total + point.cost, 0));
  }

  _getInfo() {
    const tripDestinationsGraph = Array.from(new Set(this._points.map((point) => point.destination.name)));
    const tripTimeGap = {
      start: this._points[0] ? this._points[0].start : dayjs(),
      end: this._points[this._points.length - 1] ? this._points[this._points.length - 1].end : dayjs()
    };

    this._tripInfoComponent = new TripInfo(tripDestinationsGraph, tripTimeGap);
  }

  _renderInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCost() {
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {
    const filterPresenter = new FilterPresenter(this._tripFilterContainer, this._filterModel, this._pointsModel);
    filterPresenter.init();
  }
}
