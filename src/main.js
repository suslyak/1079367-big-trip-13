import {getTripInfoTemplate} from './view/trip-info.js';
import {getTripCostTemplate} from './view/trip-cost.js';
import {getMenuTemplate} from './view/main-menu.js';
import {getFilterTemplate} from './view/trip-filters.js';
import {getSortingsTemplate} from './view/trip-sort.js';
import {getEventsListTemplate} from './view/trip-events.js';
import {getCreatePointTemplate} from './view/create-trip-point.js';
import {getEditPointTemplate} from './view/edit-trip-point.js';
import {getPiontTemplate} from './view/trip-point.js';

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const createNode = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement;
};

const insertLinearly = (container, content, place) => {
  if (typeof (place) === `string`) {
    container.insertAdjacentHTML(place, content);
  }
};

const insertPointly = (container, content, referenceElement) => {
  if (typeof (referenceElement) === `object`) {
    container.insertBefore(createNode(content), referenceElement);
  }
};

const render = (container, template, place, insertMethod) => {
  insertMethod(container, template, place);
};

render(tripMainElement, getTripInfoTemplate(), `afterbegin`, insertLinearly);

const tripInfoElement = pageHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, getTripCostTemplate(), `beforeend`, insertLinearly);

const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];

render(tripControlsElement, getMenuTemplate(), menuReferenceElement, insertPointly);
render(tripControlsElement, getFilterTemplate(), `beforeend`, insertLinearly);
render(eventsElement, getSortingsTemplate(), `beforeend`, insertLinearly);
render(eventsElement, getEventsListTemplate(), `beforeend`, insertLinearly);

const tripEventsListElement = eventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, getEditPointTemplate(), `beforeend`, insertLinearly);
render(tripEventsListElement, getCreatePointTemplate(), `beforeend`, insertLinearly);
render(tripEventsListElement, getPiontTemplate(), `beforeend`, insertLinearly);
render(tripEventsListElement, getPiontTemplate(), `beforeend`, insertLinearly);
render(tripEventsListElement, getPiontTemplate(), `beforeend`, insertLinearly);
