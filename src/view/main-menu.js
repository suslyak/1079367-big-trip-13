import {createElement} from "../utils.js";

const generateLinks = (links) => {
  return links.map((link) => `
    <a class="trip-tabs__btn  ${link.active ? `trip-tabs__btn--active` : ``}" href="${link.href}">${link.text}</a>`
  ).join(``);
};

export default class Menu {
  constructor(links = []) {
    this._element = null;
    this._links = links;
  }

  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${generateLinks(this._links)}
      </nav>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
