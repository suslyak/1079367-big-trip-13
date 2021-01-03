import AbstractView from './abstract.js';

const getFilterItems = (filter, isChecked) => {
  const {name} = filter;

  return `
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-everything">${name}</label>
  </div>
  `;
};

export default class Filter extends AbstractView {
  constructor(filters = []) {
    super();
    this._filterItems = filters.map((filter, index) => getFilterItems(filter, index === 0)).join(``);
  }

  getTemplate() {
    return `
      <form class="trip-filters" action="#" method="get">
        ${this._filterItems}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`;
  }
}
