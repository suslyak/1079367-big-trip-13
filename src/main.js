import {getTripInfoTemplate} from './view/trip-info.js';
import {getTripCostTemplate} from './view/trip-cost.js';
import {getMenuTemplate} from './view/main-menu.js';
import {getFilterTemplate} from './view/trip-filters.js';
import {getSortingTemplate} from './view/trip-sort.js';
import {getEventsListTemplate} from './view/trip-events.js';
import {getEditPointTemplate} from './view/edit-trip-point.js';
import {getPiontTemplate} from './view/trip-point.js';
import {generatePoint} from './mock/trip-point.js';
import {generateFilter} from './mock/filter.js';
import {generateSorting} from './mock/sortings.js';

import {sortByStartDates} from './utils.js';
import {renderElement, renderTemplate} from './utils.js';

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const eventsElement = pageMainElement.querySelector(`.trip-events`);

const tripPoints = new Array(20).fill().map(generatePoint);
const destinations = Array.from(new Set(tripPoints.map((point) => point.destination.name)));

destinations.sort();
tripPoints.sort(sortByStartDates);

const tripDestinationsGraph = Array.from(new Set(tripPoints.map((point) => point.destination.name)));
const tripTimeGap = {
  start: tripPoints[0].start,
  end: tripPoints.slice(-1)[0].end
};

const tripCost = tripPoints.reduce((total, point) => total + point.cost, 0);

renderTemplate(tripMainElement, getTripInfoTemplate(tripDestinationsGraph, tripTimeGap), `afterbegin`);

const tripInfoElement = pageHeaderElement.querySelector(`.trip-info`);

renderTemplate(tripInfoElement, getTripCostTemplate(tripCost), `beforeend`);

const menuReferenceElement = tripControlsElement.querySelectorAll(`h2`)[1];

renderElement(tripControlsElement, getMenuTemplate(), menuReferenceElement);
renderTemplate(tripControlsElement, getFilterTemplate(generateFilter(tripPoints)), `beforeend`);
renderTemplate(eventsElement, getSortingTemplate(generateSorting(tripPoints)), `beforeend`);
renderTemplate(eventsElement, getEventsListTemplate(), `beforeend`);

const tripEventsListElement = eventsElement.querySelector(`.trip-events__list`);

renderTemplate(tripEventsListElement, getEditPointTemplate(tripPoints[0], destinations), `beforeend`);
renderTemplate(tripEventsListElement, getEditPointTemplate({}, destinations), `beforeend`);

for (const tripPoint of tripPoints.slice(1)) {
  renderTemplate(tripEventsListElement, getPiontTemplate(tripPoint), `beforeend`);
}
