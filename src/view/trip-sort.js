import AbstractView from './abstract.js';
import {sortings} from '../utils/sorting.js';

const getSortingItems = (sorting, currentSorting) => {
  const {
    name,
    isDisabled
  } = sorting;

  return `
    <div class="trip-sort__item  trip-sort__item--${name}">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-sort-type="${name}" value="sort-${name}" ${currentSorting === name ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="trip-sort__btn" for="sort-${name}">${name}</label>
    </div>`;
};

export default class TripSort extends AbstractView {
  constructor(currentSorting) {
    super();

    this._currentSorting = currentSorting;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    const sortingItems = Object.values(sortings)
        .map((sorting) => getSortingItems(sorting, this._currentSorting))
        .join(``);

    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortingItems}
      </form>`;
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target && evt.target.matches(`input[type='radio']`)) {
      evt.preventDefault();
      evt.target.checked = true;

      this._callback.sortTypeChange(evt.target.getAttribute(`data-sort-type`));
    } else {
      return;
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
