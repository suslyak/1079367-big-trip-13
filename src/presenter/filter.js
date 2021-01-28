import FilterView from '../view/trip-filters.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../const.js';

import dayjs from 'dayjs';

export default class Filter {
  constructor(filterContainer, filterModel, pointModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointModel = pointModel;
    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: `EVERYTHING`,
        noPoints: !this._pointModel.getPoints().length
      },
      {
        type: FilterType.FUTURE,
        name: `FUTURE`,
        noPoints: !this._pointModel.getPoints().some((point) => dayjs().isBefore(point.start))
      },
      {
        type: FilterType.PAST,
        name: `PAST`,
        noPoints: !this._pointModel.getPoints().some((point) => point.end.isBefore(dayjs()))
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
