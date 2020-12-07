import {getTripInfoTemplate} from './view/trip-info.js';
import {getTripCostTemplate} from './view/trip-cost.js';
import {getMenuTemplate} from './view/main-menu.js';
import {getFilterTemplate} from './view/trip-filters.js';
import {getSortingsTemplate} from './view/trip-sort.js';
import {getEventsListTemplate} from './view/trip-events.js';
import {getEditPointTemplate} from './view/edit-trip-point.js';
import {getPiontTemplate} from './view/trip-point.js';
import {generatePoint} from './mock/trip-point.js';
import {generateDestinations} from './mock/destinations.js';

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

const destinations = generateDestinations();
const tripPoints = [];

for (let i = 0; i < 15; i++) {
  tripPoints.push(generatePoint());
}

const sortByStartDates = (a, b) => {
  if (a.startDate.isBefore(b.startDate)) {
    return -1;
  }
  if (b.startDate.isBefore(a.startDate)) {
    return 1;
  }

  return 0;
};

tripPoints.sort(sortByStartDates);

const tripDestinationsGraph = Array.from(new Set(tripPoints.map((point) => point.destination.name)));
const tripTimeGap = {
  start: tripPoints[0].startDate,
  end: tripPoints.slice(-1)[0].endDate
};

const tripCost = tripPoints.reduce((total, point) => total + point.cost, 0);

const render = (container, template, place, insertMethod) => {
  insertMethod(container, template, place);
};

render(tripMainElement, getTripInfoTemplate(tripDestinationsGraph, tripTimeGap), `afterbegin`, insertLinearly);

const tripInfoElement = pageHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, getTripCostTemplate(tripCost), `beforeend`, insertLinearly);

const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];

render(tripControlsElement, getMenuTemplate(), menuReferenceElement, insertPointly);
render(tripControlsElement, getFilterTemplate(), `beforeend`, insertLinearly);
render(eventsElement, getSortingsTemplate(), `beforeend`, insertLinearly);
render(eventsElement, getEventsListTemplate(), `beforeend`, insertLinearly);

const tripEventsListElement = eventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, getEditPointTemplate(tripPoints[0], destinations), `beforeend`, insertLinearly);
render(tripEventsListElement, getEditPointTemplate({}, destinations), `beforeend`, insertLinearly);

for (const tripPoint of tripPoints.slice(1)) {
  render(tripEventsListElement, getPiontTemplate(tripPoint), `beforeend`, insertLinearly);
}
