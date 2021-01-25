import AbstractView from './abstract.js';

const generateLinks = (links) => {
  return links.map((link, index) => `
    <a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" data-menulink-id="${link}" href="#">${link}</a>`
  ).join(``);
};

export default class Menu extends AbstractView {
  constructor(links = []) {
    super();
    this._links = links;

    this._menuClickHandler = this._menuClickHandler.bind(this);
    this.setMenuItem = this.setMenuItem.bind(this);
  }

  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${generateLinks(this._links)}
      </nav>`;
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains(`trip-tabs__btn--active`)) {
      this._callback.menuClick(evt.target.getAttribute(`data-menulink-id`), this.setMenuItem);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);

  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    const currentItem = this.getElement().querySelector(`[data-menulink-id=${menuItem}]`);

    items.forEach((item) => {
      item.classList.remove(`trip-tabs__btn--active`);
    });

    currentItem.classList.add(`trip-tabs__btn--active`);
  }
}
