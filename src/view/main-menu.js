import {getNavigationLinks} from '../mock/navigation.js';

const generateLinks = () => {
  return getNavigationLinks().map((link) => `
    <a class="trip-tabs__btn  ${link.active ? `trip-tabs__btn--active` : ``}" href="${link.href}">${link.text}</a>`
  ).join(``);
};

export const getMenuTemplate = () => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${generateLinks()}
    </nav>`;
};

