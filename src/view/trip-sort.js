import AbstractView from './abstract.js';

const getSortingItems = (sorting, isChecked) => {
  const {
    name,
    disabled: isDisabled
  } = sorting;

  return `
    <div class="trip-sort__item  trip-sort__item--${name}">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="trip-sort__btn" for="sort-${name}">${name}</label>
    </div>`;
};

export default class Sorting extends AbstractView {
  constructor(sortings = []) {
    super();
    this._sortings = sortings;
  }

  getTemplate() {
    const sortingItems = this._sortings
    .map((sorting, index) => getSortingItems(sorting, index === 0))
    .join(``);

    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortingItems}
      </form>`;
  }
}
