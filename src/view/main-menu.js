import AbstractView from "./abstract.js";

const generateLinks = (links) => {
  return links.map((link) => `
    <a class="trip-tabs__btn  ${link.active ? `trip-tabs__btn--active` : ``}" href="${link.href}">${link.text}</a>`
  ).join(``);
};

export default class Menu extends AbstractView {
  constructor(links = []) {
    super();
    this._links = links;
  }

  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${generateLinks(this._links)}
      </nav>`;
  }
}
