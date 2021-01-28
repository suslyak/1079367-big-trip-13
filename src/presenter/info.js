import dayjs from 'dayjs';

import TripInfo from '../view/trip-info.js';
import TripCost from '../view/trip-cost.js';
import FilterPresenter from '../presenter/filter.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {sortByStartDates} from '../utils/sorting.js';
import {UpdateType} from '../const.js';

export default class Info {
  constructor(tripInfoContainer, tripControlsContainer, pointsModel, filterModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripFilterContainer = tripControlsContainer.FILTER;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripInfoComponent = new TripInfo();
    this._tripCostComponent = new TripCost();

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
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
    this._tripCostComponent = new TripCost(
        this._points.reduce((total, point) => {
          return total + point.cost + point.selectedOffers.reduce((offersTotal, offer) => offersTotal + offer.cost, 0);
        }, 0)
    );
  }

  _getInfo() {
    const sortedPoints = this._points.slice().sort(sortByStartDates);
    const firstPoint = sortedPoints[0];
    const lastPoint = sortedPoints[sortedPoints.length - 1];

    const getRoute = () => {
      if (sortedPoints.length) {
        return sortedPoints.length > 3
          ? [firstPoint.destination.name, `...`, lastPoint.destination.name]
          : sortedPoints.map((point) => point.destination.name);
      }
      return [`...`, `...`];
    };

    const tripDestinationsGraph = getRoute();

    const tripTimeGap = {
      start: firstPoint ? firstPoint.start : dayjs(),
      end: lastPoint ? lastPoint.end : dayjs()
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

  _rerenderCost() {
    this._points = this._getPoints();
    remove(this._tripCostComponent);
    this._getCost();
    this._renderCost();
  }

  _rerenderInfo() {
    this._points = this._getPoints();
    remove(this._tripInfoComponent);
    this._getInfo();
    this._renderInfo();
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._rerenderInfo();
        this._rerenderCost();
        break;
    }
  }
}
